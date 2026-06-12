import { jsx, jsxs } from "react/jsx-runtime";
import { C as Card, c as CardContent } from "./router-7vaADMHT.js";
function StatCard({
  label,
  value,
  icon: Icon,
  hint,
  tone = "default"
}) {
  const toneClass = {
    default: "bg-muted text-foreground",
    success: "bg-green-100 text-green-700",
    warning: "bg-amber-100 text-amber-700",
    primary: "bg-primary/10 text-primary"
  }[tone];
  return /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsx(CardContent, { className: "p-5", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-3", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("div", { className: "text-xs uppercase tracking-wider text-muted-foreground", children: label }),
      /* @__PURE__ */ jsx("div", { className: "text-2xl font-semibold mt-1", children: value }),
      hint && /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground mt-1", children: hint })
    ] }),
    /* @__PURE__ */ jsx("div", { className: `h-10 w-10 rounded-md grid place-items-center ${toneClass}`, children: /* @__PURE__ */ jsx(Icon, { className: "h-5 w-5" }) })
  ] }) }) });
}
function formatINR(n) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(n);
}
export {
  StatCard as S,
  formatINR as f
};
