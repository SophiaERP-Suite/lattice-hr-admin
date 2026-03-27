export const fmt = (date: string) =>
    new Date(date).toLocaleDateString("en-GB", {
        day: "2-digit", month: "short", year: "numeric",
    });

export const fmtTime = (date: string | null) =>
    date
        ? new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        : "—";

export const fmtNaira = (amount: number | null | undefined) =>
    amount != null
        ? new Intl.NumberFormat("en-NG", {
            // style: "currency",
            // currency: "NGN",
            minimumFractionDigits: 2,
        }).format(amount)
        : "—";

export const fmtDate = (date: string) =>
    new Date(date).toLocaleDateString("en-GB", {
        day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
    });