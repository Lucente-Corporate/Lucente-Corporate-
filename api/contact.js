const CONTACT_TO_EMAIL = "lucentecorporate@gmail.com";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ALLOWED_TYPES = new Set([
  "General enquiry",
  "Website or app project",
  "Lucente Calendar",
  "Lucente QR",
  "Lucente Admin",
  "Partnership or collaboration"
]);
const rateLimit = new Map();

function json(response, status, body) {
  response.statusCode = status;
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  response.end(JSON.stringify(body));
}

function clientIp(request) {
  return (
    request.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
    request.headers["x-real-ip"] ||
    request.socket?.remoteAddress ||
    "unknown"
  );
}

function isRateLimited(ip) {
  const now = Date.now();
  const windowMs = 10 * 60 * 1000;
  const maxSubmissions = 4;
  const entry = rateLimit.get(ip) || { count: 0, resetAt: now + windowMs };

  if (entry.resetAt < now) {
    rateLimit.set(ip, { count: 1, resetAt: now + windowMs });
    return false;
  }

  entry.count += 1;
  rateLimit.set(ip, entry);
  return entry.count > maxSubmissions;
}

function validate(body) {
  const values = {
    name: String(body.name || "").trim(),
    email: String(body.email || "").trim(),
    enquiryType: String(body.enquiryType || "").trim(),
    message: String(body.message || "").trim(),
    consent: Boolean(body.consent),
    company_website: String(body.company_website || "").trim()
  };
  const errors = {};

  if (values.company_website) errors.form = "Spam protection rejected this submission.";
  if (values.name.length < 2 || values.name.length > 80) errors.name = "Name must be between 2 and 80 characters.";
  if (!EMAIL_PATTERN.test(values.email) || values.email.length > 120) errors.email = "Enter a valid email address.";
  if (!ALLOWED_TYPES.has(values.enquiryType)) errors.enquiryType = "Choose a valid enquiry type.";
  if (values.message.length < 20 || values.message.length > 2000) errors.message = "Message must be between 20 and 2000 characters.";
  if (!values.consent) errors.consent = "Privacy consent is required.";

  return { values, errors };
}

async function readBody(request) {
  const chunks = [];
  for await (const chunk of request) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  const raw = Buffer.concat(chunks).toString("utf8");
  if (raw.length > 8000) throw new Error("Payload too large.");
  return raw ? JSON.parse(raw) : {};
}

module.exports = async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return json(response, 405, { message: "Only POST submissions are accepted." });
  }

  try {
    if (isRateLimited(clientIp(request))) {
      return json(response, 429, { message: "Too many submissions. Please wait before trying again." });
    }

    const body = await readBody(request);
    const { values, errors } = validate(body);
    if (Object.keys(errors).length) {
      return json(response, 400, { message: "Please fix the highlighted fields.", errors });
    }

    const apiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.CONTACT_FROM_EMAIL;
    if (!apiKey || !fromEmail) {
      return json(response, 503, {
        message:
          "Email delivery is not configured yet. Please email lucentecorporate@gmail.com directly.",
        code: "EMAIL_NOT_CONFIGURED"
      });
    }

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: fromEmail,
        to: CONTACT_TO_EMAIL,
        reply_to: values.email,
        subject: `Lucente Corporate enquiry: ${values.enquiryType}`,
        text: [
          `Name: ${values.name}`,
          `Email: ${values.email}`,
          `Enquiry type: ${values.enquiryType}`,
          "",
          values.message
        ].join("\n")
      })
    });

    if (!emailResponse.ok) {
      return json(response, 502, {
        message:
          "The email provider could not send this enquiry. Please try again or email lucentecorporate@gmail.com directly.",
        code: "EMAIL_PROVIDER_ERROR"
      });
    }

    return json(response, 200, { message: "Your message has been sent to Lucente Corporate." });
  } catch (error) {
    return json(response, 400, {
      message: error.message === "Payload too large." ? "Submission is too large." : "Invalid submission format."
    });
  }
};
