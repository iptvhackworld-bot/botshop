// ================= FIX TELEGRAM =================

process.env.NTBA_FIX_350 = 1;

// ================= MODULES =================

require("dotenv").config();

const { Telegraf } = require("telegraf");
const mongoose = require("mongoose");
const express = require("express");
const fs = require("fs");

const Product = require("./models/Product");
const Admin = require("./models/Admin");
const Category = require("./models/Category");
const Roulette = require("./models/Roulette");
const Order = require("./models/Order");
const User = require("./models/User");

// ================= APP =================

const app = express();

const bot = new Telegraf(
    process.env.BOT_TOKEN
);

// ================= ANTI CRASH =================

bot.catch((err, ctx) => {

    console.log(
        "❌ Erreur Bot :",
        err
    );

    ctx.reply(
        "⚠️ Une erreur est survenue."
    );

});

// ================= CONFIG =================

async function getAdmin(userId) {

    return await Admin.findOne({

        telegramId:
            userId.toString()

    });

}

const BOT_NAME =
    "🔥 LE MEXICAIN BOURGES 🔥";

// ================= DATABASE =================

mongoose.set("strictQuery", false);

mongoose.connect(
    process.env.MONGO_URI
)

.then(async () => {

    console.log(
        "✅ MongoDB connecté"
    );

    const ownerId =
        process.env.ADMIN_ID;

    const exists =
        await Admin.findOne({
            telegramId: ownerId
        });

    if (!exists) {

        await Admin.create({

    telegramId: ownerId,

    role: "owner"

});

        console.log(
            "✅ Admin principal ajouté"
        );
    }

})

.catch((err) => {

    console.log(
        "❌ MongoDB :",
        err
    );

});

// ================= EXPRESS =================

app.get("/", (req, res) => {

    res.send("Bot actif");

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

// ================= STATES =================

const adminState = {};
const userState = {};

// ================= DB STATUS =================

let dbReady = false;

mongoose.connection.on(
    "connected",
    () => {

        dbReady = true;

        console.log(
            "✅ Base prête"
        );

    }
);

mongoose.connection.on(
    "disconnected",
    () => {

        dbReady = false;

        console.log(
            "❌ MongoDB déconnecté"
        );

    }
);

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

// ================= FIX BUTTONS =================

bot.use(async (ctx, next) => {

    if (ctx.callbackQuery) {

        try {

            await ctx.answerCbQuery();

        } catch (e) {}

    }

    return next();

});

// ================= START =================

bot.start(async (ctx) => {

    // ================= SAVE USER =================

    const userExists =
        await User.findOne({

            telegramId:
                ctx.from.id.toString()

        });

    if (!userExists) {

        await User.create({

            telegramId:
                ctx.from.id.toString(),

            username:
                ctx.from.username ||
                "Aucun"

        });

    }

    // ================= ADMIN =================

    const admin =
        await getAdmin(
            ctx.from.id
        );

    const adminAccess =
        !!admin;

    // ================= BUTTONS =================

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

    // ================= ADMIN BUTTON =================

    if (adminAccess) {

        buttons.push([

            {
                text: "👑 Admin",
                callback_data:
                    "admin_panel"
            }

        ]);

    }

    // ================= BANNER =================

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
                    inline_keyboard:
                        buttons
                }
            }

        );

    } else {

        await ctx.reply(

            `🔥 ${BOT_NAME}`,

            {
                reply_markup: {
                    inline_keyboard:
                        buttons
                }
            }

        );

    }

});

// ================= MENU =================

bot.action("menu", async (ctx) => {

    const admin =
        await getAdmin(ctx.from.id);

    const adminAccess =
        !!admin;

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

    if (adminAccess) {

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

// ================= ROULETTE =================

bot.action("roulette", async (ctx) => {

    const userId =
        ctx.from.id.toString();

    const existing =
        await Roulette.findOne({
            userId
        });

    const now =
        new Date();

    // ================= DEJA JOUE =================

    if (existing) {

        const diff =
            now - existing.lastSpin;

        const hours =
            diff / (1000 * 60 * 60);

        if (hours < 24) {

            const remaining =
                Math.ceil(
                    24 - hours
                );

            return ctx.reply(
`🎰 Roulette déjà utilisée.

⏳ Réessaie dans ${remaining}h.`
            );

        }

    }

    // ================= RANDOM =================

    const reduction =
        reductions[
            Math.floor(
                Math.random() *
                reductions.length
            )
        ];

    // ================= SAVE =================

    await Roulette.findOneAndUpdate(

        {
            userId
        },

        {
            lastSpin: now
        },

        {
            upsert: true
        }

    );

    // ================= VIDEO =================

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

// ================= SHOP =================

bot.action("shop", async (ctx) => {

    const categories =
        await Category.find();

    if (!categories.length) {

        return ctx.reply(
            "❌ Aucune catégorie"
        );

    }

    const buttons = [];

    for (const cat of categories) {

        buttons.push([
            {
                text: cat.name,
                callback_data:
                    `cat_${cat.slug}`
            }
        ]);

    }

    buttons.push([
        {
            text: "🏠 Retour",
            callback_data: "menu"
        }
    ]);

    await ctx.reply(
        "🛒 BOUTIQUE\n\nChoisis une catégorie :",
        {
            reply_markup: {
                inline_keyboard: buttons
            }
        }
    );

});

// ================= CATEGORY =================

bot.action(/cat_(.+)/, async (ctx) => {

    if (!dbReady) {

        return ctx.reply(
            "⏳ Base de données en cours de connexion..."
        );

    }

    const category =
        ctx.match[1];

    let products = [];

    try {

        products =
            await Product.find({
                category
            });

    } catch (err) {

        console.log(err);

        return ctx.reply(
            "❌ Base de données indisponible"
        );

    }

    if (!products.length) {

        return ctx.reply(
            "❌ Aucun produit"
        );

    }

    for (const product of products) {

        let pricesText = "";

        const buttons = [];

        product.prices.forEach((item) => {

            pricesText +=
`${item.quantity} → ${item.price}€\n`;

            buttons.push([
                {
                    text:
`${item.quantity} - ${item.price}€`,

                    callback_data:
`buy_${product._id}_${item.quantity}_${item.price}`
                }
            ]);

        });

        buttons.push([
            {
                text: "🏠 Retour",
                callback_data: "shop"
            }
        ]);

        const caption =
`🛒 ${product.name}

📄 Description :
${product.description}

💰 Tarifs :
${pricesText}

📦 Stock :
${product.stock}`;

        // ===== VIDEO =====

        if (product.videoFile) {

            await ctx.replyWithVideo(
                product.videoFile,
                {
                    caption,
                    reply_markup: {
                        inline_keyboard: buttons
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
                        inline_keyboard: buttons
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
                        inline_keyboard: buttons
                    }
                }
            );

        }

    }

});
// ================= BUY =================

bot.action(/buy_(.+)/, async (ctx) => {

    const data =
        ctx.match[1].split("_");

    const productId =
        data[0];

    const quantity =
        data[1];

    const price =
        data[2];

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

Produit :
${product.name}

📦 Format :
${quantity}

💰 Prix :
${price}€`,
        {
            reply_markup: {
                inline_keyboard: [

                    [
                        {
                            text:
                                "✅ Confirmer Achat",

                            callback_data:
`confirm_${product._id}_${quantity}_${price}`
                        }
                    ],

                    [
                        {
                            text:
                                "🏠 Retour",

                            callback_data:
                                "shop"
                        }
                    ]

                ]
            }
        }
    );

});

// ================= CONFIRM =================

// ================= CONFIRM =================

bot.action(/confirm_(.+)/, async (ctx) => {

    const data =
        ctx.match[1].split("_");

    const productId =
        data[0];

    const quantity =
        data[1];

    const total =
        parseFloat(data[2]);

    const product =
        await Product.findById(
            productId
        );

    if (!product) {

        return ctx.reply(
            "❌ Produit introuvable"
        );

    }

    // ================= SAVE ORDER =================

    const order =
        await Order.create({

            clientId:
                ctx.from.id.toString(),

            username:
                ctx.from.username ||
                "Aucun username",

            productId:
                product._id.toString(),

            productName:
                product.name,

            quantity,

            total,

            status:
                "pending"

        });

    // ================= SEND ADMINS =================

    const admins =
        await Admin.find();

    for (const admin of admins) {

        await bot.telegram.sendMessage(

            admin.telegramId,

`🚨 NOUVELLE COMMANDE

👤 Client :
@${ctx.from.username || "Aucun username"}

🛒 Produit :
${product.name}

📦 Format :
${quantity}

💰 Total :
${total}€

🆔 Client ID :
${ctx.from.id}`,

            {
                reply_markup: {
                    inline_keyboard: [

                        [
                            {
                                text:
                                    "✅ Valider",

                                callback_data:
`validate_${order._id}`
                            }
                        ],

                        [
                            {
                                text:
                                    "❌ Refuser",

                                callback_data:
`reject_${order._id}`
                            }
                        ]

                    ]
                }
            }

        );

    }

    await ctx.reply(
`✅ Commande envoyée

⏳ En attente de validation administrateur.`,
        {
            reply_markup: {
                inline_keyboard: [

                    [
                        {
                            text:
                                "🏠 Retour Menu",

                            callback_data:
                                "menu"
                        }
                    ]

                ]
            }
        }
    );

});

// ================= VALIDATE ORDER =================

bot.action(
    /validate_(.+)/,
    async (ctx) => {

        const orderId =
            ctx.match[1];

        const order =
            await Order.findById(
                orderId
            );

        if (!order) {

            return ctx.reply(
                "❌ Commande introuvable"
            );

        }

        order.status =
            "validated";

        await order.save();

        // ================= MESSAGE CLIENT =================

        await bot.telegram.sendMessage(

            order.clientId,

`🎉 Votre commande a été validée avec succès !

🙏 Merci d'avoir commandé dans notre boutique.

📦 Votre commande est maintenant en préparation.

🔥 ${BOT_NAME}`

        );

        await ctx.reply(
            "✅ Commande validée"
        );

    }
);

// ================= REJECT ORDER =================

bot.action(
    /reject_(.+)/,
    async (ctx) => {

        const orderId =
            ctx.match[1];

        const order =
            await Order.findById(
                orderId
            );

        if (!order) {

            return ctx.reply(
                "❌ Commande introuvable"
            );

        }

        order.status =
            "rejected";

        await order.save();

        // ================= MESSAGE CLIENT =================

        await bot.telegram.sendMessage(

            order.clientId,

`❌ Votre commande a été refusée.

📩 Contactez un administrateur pour plus d'informations.

🔥 ${BOT_NAME}`

        );

        await ctx.reply(
            "❌ Commande refusée"
        );

    }
);

// ================= ADMIN PANEL =================

bot.action(
    "admin_panel",
    async (ctx) => {

        const admin =
            await getAdmin(
                ctx.from.id
            );

        if (!admin) {

            return ctx.reply(
                "❌ Accès refusé"
            );

        }

        const buttons = [

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
            ]

        ];

        // ===== ADMIN + OWNER =====

        if (
            admin.role === "admin" ||
            admin.role === "owner"
        ) {

            buttons.push([

                {
                    text:
                        "📂 Ajouter Catégorie",

                    callback_data:
                        "add_category"
                }

            ]);

        }

        // ===== OWNER =====

        if (
            admin.role === "owner"
        ) {

            buttons.push([

                {
                    text:
                        "👑 Ajouter Admin",

                    callback_data:
                        "add_admin"
                }

            ]);

            buttons.push([

                {
                    text:
                        "🔧 Ajouter Modérateur",

                    callback_data:
                        "add_moderator"
                }

            ]);

        }

        // ===== RETOUR =====

        buttons.push([

            {
                text:
                    "🏠 Retour",

                callback_data:
                    "menu"
            }

        ]);

        await ctx.reply(
`👑 PANEL ADMIN

🛡 Rôle :
${admin.role}`,
            {
                reply_markup: {
                    inline_keyboard:
                        buttons
                }
            }
        );

    }
);

// ================= ADD ADMIN =================

bot.action(
    "add_admin",
    async (ctx) => {

        const admin =
            await getAdmin(
                ctx.from.id
            );

        if (
            admin?.role !==
            "owner"
        ) {

            return ctx.reply(
                "❌ Accès refusé"
            );

        }

        adminState[
            ctx.from.id
        ] = {

            step:
                "add_admin"

        };

        await ctx.reply(
            "👑 Envoie l'ID Telegram du nouvel admin"
        );

    }
);

// ================= ADD MODERATOR =================

bot.action(
    "add_moderator",
    async (ctx) => {

        const admin =
            await getAdmin(
                ctx.from.id
            );

        if (
            admin?.role !==
            "owner"
        ) {

            return ctx.reply(
                "❌ Accès refusé"
            );

        }

        adminState[
            ctx.from.id
        ] = {

            step:
                "add_moderator"

        };

        await ctx.reply(
            "🔧 Envoie l'ID Telegram du modérateur"
        );

    }
);



// ================= ADD CATEGORY =================

bot.action(
    "add_category",
    async (ctx) => {

        adminState[
            ctx.from.id
        ] = {

            step:
                "add_category"

        };

        await ctx.reply(
            "📂 Envoie le nom de la catégorie"
        );

    }
);

// ================= VIEW PRODUCTS =================

bot.action(
    "admin_products",
    async (ctx) => {

        let products = [];

        try {

            products =
                await Product.find();

        } catch (err) {

            console.log(err);

            return ctx.reply(
                "❌ Base de données indisponible"
            );

        }

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
💰 Multi tarifs

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

        let products = [];

        try {

            products =
                await Product.find();

        } catch (err) {

            console.log(err);

            return ctx.reply(
                "❌ Base de données indisponible"
            );

        }

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

            step:
                "category"

        };

        await ctx.reply(
`➕ AJOUT PRODUIT

Envoie le slug exact de la catégorie.

Exemple :

hash
hashpremium
weed
fete`
        );

    }
);

// ================= TEXT =================

bot.on("text", async (ctx) => {

    // ================= USER STATE =================

    const user =
        userState[
            ctx.from.id
        ];

    if (
        user?.step ===
        "waiting_quantity"
    ) {

        const quantity =
            parseInt(
                ctx.message.text
            );

        if (
            isNaN(quantity) ||
            quantity <= 0
        ) {

            return ctx.reply(
                "❌ Quantité invalide"
            );

        }

        return ctx.reply(
            "❌ Ancien système désactivé"
        );

    }

    // ================= ADMIN STATE =================

    const state =
        adminState[
            ctx.from.id
        ];

    if (!state) return;

    // ===== ADD ADMIN =====

if (
    state.step ===
    "add_admin"
) {

    await Admin.create({

        telegramId:
            ctx.message.text,

        role:
            "admin"

    });

    delete adminState[
        ctx.from.id
    ];

    return ctx.reply(
        "✅ Nouvel admin ajouté"
    );

}

// ===== ADD MODERATOR =====

if (
    state.step ===
    "add_moderator"
) {

    await Admin.create({

        telegramId:
            ctx.message.text,

        role:
            "moderator"

    });

    delete adminState[
        ctx.from.id
    ];

    return ctx.reply(
        "✅ Modérateur ajouté"
    );

}

    // ===== ADD CATEGORY =====

    if (
        state.step ===
        "add_category"
    ) {

        const name =
            ctx.message.text;

        const slug = name
            .toLowerCase()
            .replace(/ /g, "_");

        await Category.create({

            name,
            slug

        });

        delete adminState[
            ctx.from.id
        ];

        return ctx.reply(
            "✅ Catégorie ajoutée"
        );

    }

    // ===== CATEGORY =====

    if (
        state.step ===
        "category"
    ) {

        state.category =
            ctx.message.text;

        state.step =
            "name";

        return ctx.reply(
            "📝 Nom du produit ?"
        );

    }

    // ===== NAME =====

    if (
        state.step ===
        "name"
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

        state.step =
            "price";

        return ctx.reply(
            "💰 Prix ?"
        );

    }

// ===== PRICE =====

if (
    state.step ===
    "price"
) {

    if (!state.prices) {

        state.prices = [];

    }

    const data =
        ctx.message.text.split("=");

    if (data.length < 2) {

        return ctx.reply(
`❌ Format invalide

Exemple :
1G=10`
        );

    }

    const quantity =
        data[0];

    const price =
        parseFloat(data[1]);

    state.prices.push({

        quantity,
        price

    });

    state.step =
        "add_more_prices";

    return ctx.reply(
`✅ Tarif ajouté

${quantity} → ${price}€

➕ Ajouter un autre tarif ?

Réponds :

oui
ou
non`
    );

}

// ===== ADD MORE PRICES =====

if (
    state.step ===
    "add_more_prices"
) {

    const response =
        ctx.message.text
            .toLowerCase();

    if (response === "oui") {

        state.step = "price";

        return ctx.reply(
`📦 Nouveau format ?

Exemple :
3G=25`
        );

    }

    if (response === "non") {

        state.step = "stock";

        return ctx.reply(
            "📦 Stock ?"
        );

    }

    return ctx.reply(
        "❌ Réponds uniquement par oui ou non"
    );

}

    // ===== STOCK =====

    if (
        state.step ===
        "stock"
    ) {

        state.stock =
            ctx.message.text;

        state.step =
            "media";

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

    // ================= SAVE PRODUCT =================

    await Product.create({

        category:
            state.category,

        name:
            state.name,

        description:
            state.description,

        prices:
            state.prices,

        stock:
            state.stock,

        photoFile:
            fileId,

        videoFile:
            null

    });

    // ================= DIFFUSION =================

    const users =
        await User.find();

    for (const user of users) {

        try {

            await bot.telegram.sendPhoto(

                user.telegramId,

                fileId,

                {
                    caption:
`🔥 NOUVEAU PRODUIT DISPONIBLE

🛒 ${state.name}

📄 ${state.description}

🔥 Disponible maintenant dans la boutique !`
                }

            );

        } catch (err) {

            console.log(
                `❌ Diffusion impossible à ${user.telegramId}`
            );

        }

    }

    // ================= RESET =================

    delete adminState[
        ctx.from.id
    ];

    await ctx.reply(
        "✅ Produit ajouté + diffusé à tous les utilisateurs"
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

    // ================= SAVE PRODUCT =================

    await Product.create({

        category:
            state.category,

        name:
            state.name,

        description:
            state.description,

        prices:
            state.prices,

        stock:
            state.stock,

        photoFile:
            null,

        videoFile:
            fileId

    });

    // ================= DIFFUSION =================

    const users =
        await User.find();

    for (const user of users) {

        try {

            await bot.telegram.sendVideo(

                user.telegramId,

                fileId,

                {
                    caption:
`🔥 NOUVEAU PRODUIT DISPONIBLE

🛒 ${state.name}

📄 ${state.description}

🔥 Disponible maintenant dans la boutique !`
                }

            );

        } catch (err) {

            console.log(
                `❌ Diffusion impossible à ${user.telegramId}`
            );

        }

    }

    // ================= RESET =================

    delete adminState[
        ctx.from.id
    ];

    await ctx.reply(
        "✅ Produit ajouté + diffusé à tous les utilisateurs"
    );

});

// ================= WEBHOOK =================

const PORT =
    process.env.PORT || 3000;

const RENDER_URL =
    process.env.RENDER_EXTERNAL_URL;

if (RENDER_URL) {

    bot.telegram.setWebhook(
        `${RENDER_URL}/bot`
    );

    app.use(
        bot.webhookCallback("/bot")
    );

    console.log(
        "🚀 Bot lancé en WEBHOOK"
    );

} else {

    bot.launch();

    console.log(
        "🚀 Bot lancé en LOCAL"
    );

}

// ================= SERVER =================

app.listen(PORT, () => {

    console.log(
        `🌐 Serveur lancé sur le port ${PORT}`
    );

});
