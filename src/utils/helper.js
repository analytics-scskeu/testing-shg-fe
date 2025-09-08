export function escapeHTML(str) {
    if (!str) {
        return "";
    }
    return str
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#039;/g, "'")
        .replace(/&#x2F;/g, "/");
}

export function convertCurrencyCode(code) {
    const currencySymbols = {
        USD: "$",
        EUR: "€",
        GBP: "£",
        JPY: "¥",
        CNY: "¥",
        KRW: "₩",
        INR: "₹",
        CAD: "C$",
        AUD: "A$",
        SEK: "kr",
        NOK: "kr",
        DKK: "kr",
    };

    return currencySymbols[code] ?? code;
}

export function formatPrice(currency, price, decimals = 2) {
    return convertCurrencyCode(currency) + price.toFixed(decimals);
}

export const tParserValidation = (T, message, prefix = "validations.") => {
    if (!message) {
        return null;
    }

    if (message?.key) {
        if (!T.has(prefix + message?.key)) {
            return message.key;
        }
        return T(prefix + message?.key, message?.params);
    }

    if (!T.has(prefix + message)) {
        return message;
    }

    return T(prefix + message);
};

export const getSubdomain = (host) => {
    const parts = host.split(".");
    if (parts.length > 2 && availableSubdomainLanguages[parts[0]]) {
        return parts[0];
    }
    return null;
};

export const availableSubdomainLanguages = {
    de: ["de", "en"],
    fr: ["fr", "en"],
    it: ["it", "en"],
    pl: ["pl", "en"],
    uk: ["en"],
};

export const subDomainStore = (code) => {
    const mapStores = {
        base: null,
        germany_website: "de",
        france_website: "fr",
        italy_website: "it",
        poland_website: "pl",
        uk_website: "uk",
    };

    return mapStores[code];
};

export const parseProductData = (productData) => {
    const result = {
        qty_de: 0,
        qty_jp: 0,
        stock_locations: [],
        stock_total: 0,
    };
    if (!productData.return_value?.item) {
        return result;
    }

    result.qty_de = parseInt(productData.return_value.item.avail_qty_de);
    result.qty_jp = parseInt(productData.return_value.item.avail_qty_jp);
    result.stock_total = result.qty_de + result.qty_jp;

    if (result.qty_de && result.qty_jp) {
        result.stock_locations = ["Europe", "Japan"];
    } else if (result.qty_de) {
        result.stock_locations = ["Europe"];
    } else if (result.qty_jp) {
        result.stock_locations = ["Japan"];
    } else {
        result.stock_locations = [];
    }

    return result;
};
