const { z } = require("zod");
const { VERDICTS, RISK_LEVELS, THREAT_CATEGORIES } = require("../config/constants");

const firewallVerdictSchema = z.object({
  verdict: z.enum(Object.values(VERDICTS)),
  risk_level: z.enum(Object.values(RISK_LEVELS)),
  threat_category: z.enum(Object.values(THREAT_CATEGORIES)),
  rationale: z.string().min(1),
  intent: z.string().nullable().optional(),
  requires_confirmation: z.boolean().default(false),
  permitted_action: z.string().nullable().optional(),
});

function validateFirewallOutput(rawOutput) {
  try {
    let parsed = rawOutput;
    if (typeof rawOutput === "string") {
      // Try to parse JSON from markdown code block or plain json
      const cleaned = rawOutput.replace(/```(?:json)?\s*([\s\S]*?)\s*```/, "$1").trim();
      parsed = JSON.parse(cleaned);
    }

    const validated = firewallVerdictSchema.safeParse(parsed);
    if (!validated.success) {
      return {
        isValid: false,
        error: "Malformed firewall output schema",
        data: null,
      };
    }

    return {
      isValid: true,
      error: null,
      data: validated.data,
    };
  } catch (err) {
    return {
      isValid: false,
      error: `Failed to parse LLM output: ${err.message}`,
      data: null,
    };
  }
}

module.exports = {
  firewallVerdictSchema,
  validateFirewallOutput,
};
