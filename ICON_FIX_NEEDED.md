## Icon Fix Summary

The issue is that we replaced `Percent` → `Hash`, but **`Hash` is also an invalid lucide-react icon export**!

Need to replace `Hash` with a valid icon like:
- `Calculator`
- `Info`
- `HelpCircle`

Or just remove the icon usage entirely since it's just decorative.
