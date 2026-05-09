// ================= FIX TELEGRAM =================

process.env.NTBA_FIX_350 = 1;

// ================= MODULES =================

require("dotenv").config();

const { Telegraf } = require("telegraf");
const mongoose = require("mongoose");
const express = require("express");
const fs = require("fs");

const Product = require("./models/Product");

// ================= APP =================

const app = express();

const bot = new Telegraf(process.env.BOT_TOKEN);

// ================= CONFIG =================

const ADMIN_IDS =
    process.env.ADMIN_ID.split(",");

const BOT_NAME =
    "🔥 LE MEXICAIN BOURGES 🔥";

// ================= DATABASE =================

mongoose
    .connect(process.env.MONGO_URI)
    .then(() =>
        console.log("✅ MongoDB connecté")
    )
    .catch((err) =>
        console.log("❌ MongoDB :", err)
    );

// ================= EXPRESS =================

app.get("/", (req, res) => {
    res.send("Bot actif");
});

app.listen(3000, () => {
    console.log(
        "🌐 Serveur lancé sur le port 3000"
    );
});

// ================= HORAIRES =================

const horaires = {

    lundi: "12h - 2h",

    mardi: "12h - 2h",

    mercredi: "12h - 2h",

    jeudi: "12h - 2h",

    vendredi: "12h - 2h",

    samedi: "12h - 2h",

    dimanche: "12h - 2h",

    livraison: "13h - 00h"

};

// ================= ADMIN STATE =================

const adminState = {};

// ================= ROULETTE =================

const reductions = [
    "5%",
    "10%",
    "15%",
    "20%",
    "25%",
    "50%",
    "75%"
];

// ================= START =================

bot.start(async (ctx) => {

    const isAdmin =
        ADMIN_IDS.includes(
            ctx.from.id.toString()
        );

    const buttons = [

        [
            {
                text: "🛒 Boutique",
                callback_data: "shop"
            }
        ],

        [
            {
                text: "🎰 Roulette",
                callback_data: "roulette"
            }
        ],

        [
            {
                text: "🕒 Horaires",
                callback_data: "horaires"
            }
        ]

    ];

    if (isAdmin) {

        buttons.push([
            {
                text: "👑 Admin",
                callback_data: "admin_panel"
            }
        ]);

    }

    const banner =
        "./assets/banner.jpg";

    if (fs.existsSync(banner)) {

        await ctx.replyWithPhoto(
            { source: banner },
            {
                caption:
`🔥 ${BOT_NAME}

🛒 Boutique Premium`,
                reply_markup: {
                    inline_keyboard: buttons
                }
            }
        );

    } else {

        await ctx.reply(
            `🔥 ${BOT_NAME}`,
            {
                reply_markup: {
                    inline_keyboard: buttons
                }
            }
        );

    }

});

// ================= MENU =================

bot.action("menu", async (ctx) => {

    const isAdmin =
        ADMIN_IDS.includes(
            ctx.from.id.toString()
        );

    const buttons = [

        [
            {
                text: "🛒 Boutique",
                callback_data: "shop"
            }
        ],

        [
            {
                text: "🎰 Roulette",
                callback_data: "roulette"
            }
        ],

        [
            {
                text: "🕒 Horaires",
                callback_data: "horaires"
            }
        ]

    ];

    if (isAdmin) {

        buttons.push([
            {
                text: "👑 Admin",
                callback_data: "admin_panel"
            }
        ]);

    }

    await ctx.reply(
        "🏠 MENU PRINCIPAL",
        {
            reply_markup: {
                inline_keyboard: buttons
            }
        }
    );

});

// ================= HORAIRES =================

bot.action("horaires", async (ctx) => {

    await ctx.reply(
`🕒 HORAIRES D'OUVERTURE

📅 Lundi : ${horaires.lundi}
📅 Mardi : ${horaires.mardi}
📅 Mercredi : ${horaires.mercredi}
📅 Jeudi : ${horaires.jeudi}
📅 Vendredi : ${horaires.vendredi}
📅 Samedi : ${horaires.samedi}
📅 Dimanche : ${horaires.dimanche}

🚚 Livraison : ${horaires.livraison}`,
        {
            reply_markup: {
                inline_keyboard: [

                    [
                        {
                            text: "🏠 Retour Menu",
                            callback_data: "menu"
                        }
                    ]

                ]
            }
        }
    );

});

// ================= SHOP =================

bot.action("shop", async (ctx) => {

    await ctx.reply(
        "🛒 BOUTIQUE\n\nChoisis une catégorie :",
        {
            reply_markup: {
                inline_keyboard: [

                    [
                        {
                            text: "🍫 HASH",
                            callback_data: "cat_hash"
                        }
                    ],

                    [
                        {
                            text: "💎 HASH PREMIUM",
                            callback_data: "cat_hashPremium"
                        }
                    ],

                    [
                        {
                            text: "🌿 WEED",
                            callback_data: "cat_weed"
                        }
                    ],

                    [
                        {
                            text: "🎉 LA FÊTE",
                            callback_data: "cat_fete"
                        }
                    ],

                    [
                        {
                            text: "🏠 Retour",
                            callback_data: "menu"
                        }
                    ]

                ]
            }
        }
    );

});

// ================= CATEGORY =================

bot.action(/cat_(.+)/, async (ctx) => {

    const category = ctx.match[1];

    const products =
        await Product.find({
            category: category
        });

    if (!products.length) {
        return ctx.reply(
            "❌ Aucun produit"
        );
    }

    for (const product of products) {

        const caption =
`🛒 ${product.name}

📄 Description : ${product.description}
💰 Prix : ${product.price}
📦 Stock : ${product.stock}`;

        // ===== VIDEO =====

        if (product.videoFile) {

            await ctx.replyWithVideo(
                product.videoFile,
                {
                    caption,
                    reply_markup: {
                        inline_keyboard: [
                            [
                                {
                                    text: "🛒 Commander",
                                    callback_data:
                                        `buy_${product._id}`
                                }
                            ]
                        ]
                    }
                }
            );

        }

        // ===== PHOTO =====

        else if (product.photoFile) {

            await ctx.replyWithPhoto(
                product.photoFile,
                {
                    caption,
                    reply_markup: {
                        inline_keyboard: [
                            [
                                {
                                    text: "🛒 Commander",
                                    callback_data:
                                        `buy_${product._id}`
                                }
                            ]
                        ]
                    }
                }
            );

        }

        // ===== TEXTE =====

        else {

            await ctx.reply(
                caption,
                {
                    reply_markup: {
                        inline_keyboard: [
                            [
                                {
                                    text: "🛒 Commander",
                                    callback_data:
                                        `buy_${product._id}`
                                }
                            ]
                        ]
                    }
                }
            );

        }

    }

});

// ================= BUY =================

bot.action(/buy_(.+)/, async (ctx) => {

    const productId =
        ctx.match[1];

    const product =
        await Product.findById(
            productId
        );

    if (!product) {
        return ctx.reply(
            "❌ Produit introuvable"
        );
    }

    await ctx.reply(
`🛒 COMMANDE

Produit : ${product.name}
Prix : ${product.price}`,
        {
            reply_markup: {
                inline_keyboard: [

                    [
                        {
                            text: "✅ Confirmer Achat",
                            callback_data:
                                `confirm_${product._id}`
                        }
                    ],

                    [
                        {
                            text: "⬅️ Retour",
                            callback_data: "shop"
                        }
                    ]

                ]
            }
        }
    );

});

// ================= CONFIRM =================

bot.action(/confirm_(.+)/, async (ctx) => {

    const productId =
        ctx.match[1];

    const product =
        await Product.findById(
            productId
        );

    if (!product) {
        return ctx.reply(
            "❌ Produit introuvable"
        );
    }

    for (const admin of ADMIN_IDS) {

        await bot.telegram.sendMessage(
            admin,
`🚨 NOUVELLE COMMANDE

👤 Client :
@${ctx.from.username || "Aucun username"}

🛒 Produit : ${product.name}

💰 Prix : ${product.price}

🆔 Client ID : ${ctx.from.id}`
        );

    }

    await ctx.reply(
`✅ Commande envoyée

📩 L'administrateur va te contacter.`,
        {
            reply_markup: {
                inline_keyboard: [

                    [
                        {
                            text: "🏠 Retour Menu",
                            callback_data: "menu"
                        }
                    ]

                ]
            }
        }
    );

});

// ================= ROULETTE =================

bot.action("roulette", async (ctx) => {

    const reduction =
        reductions[
            Math.floor(
                Math.random() *
                reductions.length
            )
        ];

    const rouletteVideo =
        "./assets/roulette.mp4";

    if (
        fs.existsSync(
            rouletteVideo
        )
    ) {

        await ctx.replyWithVideo(
            { source: rouletteVideo },
            {
                caption:
`🎰 ROULETTE

🎉 Tu as gagné ${reduction} de réduction !`
            }
        );

    } else {

        await ctx.reply(
`🎰 Tu as gagné ${reduction}`
        );

    }

});

// ================= ADMIN PANEL =================

bot.action(
    "admin_panel",
    async (ctx) => {

        if (
            !ADMIN_IDS.includes(
                ctx.from.id.toString()
            )
        ) {
            return ctx.reply(
                "❌ Accès refusé"
            );
        }

        await ctx.reply(
`👑 PANEL ADMIN`,
            {
                reply_markup: {
                    inline_keyboard: [

                        [
                            {
                                text:
                                    "➕ Ajouter Produit",
                                callback_data:
                                    "admin_add"
                            }
                        ],

                        [
                            {
                                text:
                                    "📦 Voir Produits",
                                callback_data:
                                    "admin_products"
                            }
                        ],

                        [
                            {
                                text:
                                    "🗑 Supprimer Produit",
                                callback_data:
                                    "admin_delete"
                            }
                        ],

                        [
                            {
                                text:
                                    "🏠 Retour",
                                callback_data:
                                    "menu"
                            }
                        ]

                    ]
                }
            }
        );

    }
);

// ================= VIEW PRODUCTS =================

bot.action(
    "admin_products",
    async (ctx) => {

        const products =
            await Product.find();

        if (!products.length) {
            return ctx.reply(
                "❌ Aucun produit"
            );
        }

        let text =
            "📦 LISTE PRODUITS\n\n";

        products.forEach(
            (product) => {

                text +=
`🛒 ${product.name}
📂 ${product.category}
💰 ${product.price}

`;

            }
        );

        await ctx.reply(text);

    }
);

// ================= DELETE MENU =================

bot.action(
    "admin_delete",
    async (ctx) => {

        const products =
            await Product.find();

        if (!products.length) {
            return ctx.reply(
                "❌ Aucun produit"
            );
        }

        const buttons = [];

        products.forEach(
            (product) => {

                buttons.push([
                    {
                        text:
                            `🗑 ${product.name}`,
                        callback_data:
                            `delete_${product._id}`
                    }
                ]);

            }
        );

        await ctx.reply(
            "🗑 Choisis un produit",
            {
                reply_markup: {
                    inline_keyboard:
                        buttons
                }
            }
        );

    }
);

// ================= DELETE PRODUCT =================

bot.action(
    /delete_(.+)/,
    async (ctx) => {

        const id =
            ctx.match[1];

        await Product.findByIdAndDelete(
            id
        );

        await ctx.reply(
            "✅ Produit supprimé"
        );

    }
);

// ================= ADD PRODUCT =================

bot.action(
    "admin_add",
    async (ctx) => {

        adminState[
            ctx.from.id
        ] = {
            step: "category"
        };

        await ctx.reply(
`➕ AJOUT PRODUIT

Envoie une catégorie :

hash
hashPremium
weed
fete`
        );

    }
);

// ================= TEXT =================

bot.on("text", async (ctx) => {

    const state =
        adminState[
            ctx.from.id
        ];

    if (!state) return;

    // ===== CATEGORY =====

    if (
        state.step ===
        "category"
    ) {

        state.category =
            ctx.message.text;

        state.step = "name";

        return ctx.reply(
            "📝 Nom du produit ?"
        );

    }

    // ===== NAME =====

    if (
        state.step === "name"
    ) {

        state.name =
            ctx.message.text;

        state.step =
            "description";

        return ctx.reply(
            "📄 Description ?"
        );

    }

    // ===== DESCRIPTION =====

    if (
        state.step ===
        "description"
    ) {

        state.description =
            ctx.message.text;

        state.step = "price";

        return ctx.reply(
            "💰 Prix ?"
        );

    }

    // ===== PRICE =====

    if (
        state.step === "price"
    ) {

        state.price =
            ctx.message.text;

        state.step = "stock";

        return ctx.reply(
            "📦 Stock ?"
        );

    }

    // ===== STOCK =====

    if (
        state.step === "stock"
    ) {

        state.stock =
            ctx.message.text;

        state.step = "media";

        return ctx.reply(
`📷 Envoie maintenant :

- une PHOTO
OU
- une VIDÉO`
        );

    }

});

// ================= PHOTO =================

bot.on("photo", async (ctx) => {

    const state =
        adminState[
            ctx.from.id
        ];

    if (
        !state ||
        state.step !==
            "media"
    ) return;

    const fileId =
        ctx.message.photo.pop()
            .file_id;

    await Product.create({

        category:
            state.category,

        name: state.name,

        description:
            state.description,

        price: state.price,

        stock: state.stock,

        photoFile: fileId,

        videoFile: null

    });

    delete adminState[
        ctx.from.id
    ];

    await ctx.reply(
        "✅ Produit ajouté"
    );

});

// ================= VIDEO =================

bot.on("video", async (ctx) => {

    const state =
        adminState[
            ctx.from.id
        ];

    if (
        !state ||
        state.step !==
            "media"
    ) return;

    const fileId =
        ctx.message.video.file_id;

    await Product.create({

        category:
            state.category,

        name: state.name,

        description:
            state.description,

        price: state.price,

        stock: state.stock,

        photoFile: null,

        videoFile: fileId

    });

    delete adminState[
        ctx.from.id
    ];

    await ctx.reply(
        "✅ Produit ajouté"
    );

});

// ================= BOT =================

bot.launch();

console.log(
    "🚀 Bot Telegram lancé"
);