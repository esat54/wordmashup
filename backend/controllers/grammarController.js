const Grammar = require('../models/Grammar');
const GrammarUserFavorite = require('../models/GrammarUserFavorite');

exports.getAllGrammars = async (req, res) => {
    try {
        const { category, search } = req.query;
        const userId = req.userId;

        let query = {};

        if (category && category !== "all") {
            query.category = category;
        }

        if (search && search.trim() !== "") {
            query.$or = [
                { title: { $regex: search, $options: "i" } },
                { category: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } }
            ];
        }

        const grammars = await Grammar.find(query).sort({ createdAt: -1 });

        const grammarIds = grammars.map(g => g._id);
        const userFavorites = await GrammarUserFavorite.find({
            userId: userId,
            grammarId: { $in: grammarIds }
        });

        const favoritesMap = {};
        userFavorites.forEach(fav => {
            favoritesMap[fav.grammarId.toString()] = {
                isPinned: fav.isPinned
            };
        });

        const grammarsWithFavorites = grammars.map(grammar => {
            const favorite = favoritesMap[grammar._id.toString()] || { isPinned: false };
            return {
                ...grammar.toObject(),
                isPinned: favorite.isPinned
            };
        });

        const pinnedGrammars = grammarsWithFavorites.filter(g => g.isPinned);
        const unpinnedGrammars = grammarsWithFavorites.filter(g => !g.isPinned);
        const sortedGrammars = [...pinnedGrammars, ...unpinnedGrammars];

        res.status(200).json({
            grammars: sortedGrammars,
            count: sortedGrammars.length
        });
    } catch (error) {
        console.error("getAllGrammars error:", error);
        res.status(500).json({ message: "Gramer konuları getirilirken hata oluştu" });
    }
};

exports.getGrammarById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;

        const grammar = await Grammar.findById(id);
        if (!grammar) {
            return res.status(404).json({ message: 'Gramer konusu bulunamadı' });
        }

        const favorite = await GrammarUserFavorite.findOne({
            userId: userId,
            grammarId: id
        });

        res.status(200).json({
            ...grammar.toObject(),
            isPinned: favorite?.isPinned || false
        });
    } catch (error) {
        console.error("getGrammarById error:", error);
        res.status(500).json({ message: "Gramer konusu getirilirken hata oluştu" });
    }
};

exports.togglePin = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;

        const grammar = await Grammar.findById(id);
        if (!grammar) {
            return res.status(404).json({ message: 'Gramer konusu bulunamadı' });
        }

        let favorite = await GrammarUserFavorite.findOne({
            userId: userId,
            grammarId: id
        });

        if (!favorite) {
            favorite = new GrammarUserFavorite({
                userId: userId,
                grammarId: id,
                isPinned: true
            });
        } else {
            favorite.isPinned = !favorite.isPinned;
        }

        await favorite.save();

        res.status(200).json({
            message: favorite.isPinned ? 'Sabitlendi' : 'Sabit kaldırıldı',
            isPinned: favorite.isPinned
        });
    } catch (error) {
        console.error("togglePin error:", error);
        res.status(500).json({ message: "Sabitleme işlemi sırasında hata oluştu" });
    }
};

exports.getCategories = async (req, res) => {
    try {
        const categories = await Grammar.distinct("category");
        res.status(200).json({ categories });
    } catch (error) {
        console.error("getCategories error:", error);
        res.status(500).json({ message: "Kategoriler getirilirken hata oluştu" });
    }
};

exports.createGrammar = async (req, res) => {
    try {
        const { category, title, description, formula, rules, notes, examples } = req.body;

        if (!category || !title) {
            return res.status(400).json({ message: 'Kategori ve başlık zorunludur' });
        }

        const grammar = new Grammar({
            category,
            title,
            description: description || "",
            formula: formula || "",
            rules: rules || "",
            notes: notes || "",
            examples: examples || []
        });

        await grammar.save();

        res.status(201).json({
            message: 'Gramer konusu başarıyla eklendi',
            grammar
        });
    } catch (error) {
        console.error("createGrammar error:", error);
        res.status(500).json({ message: "Gramer konusu eklenirken hata oluştu" });
    }
};

exports.updateGrammar = async (req, res) => {
    try {
        const { id } = req.params;
        const { category, title, description, formula, rules, notes, examples } = req.body;

        const grammar = await Grammar.findById(id);
        if (!grammar) {
            return res.status(404).json({ message: 'Gramer konusu bulunamadı' });
        }

        grammar.category = category || grammar.category;
        grammar.title = title || grammar.title;
        grammar.description = description !== undefined ? description : grammar.description;
        grammar.formula = formula !== undefined ? formula : grammar.formula;
        grammar.rules = rules !== undefined ? rules : grammar.rules;
        grammar.notes = notes !== undefined ? notes : grammar.notes;
        grammar.examples = examples || grammar.examples;

        await grammar.save();

        res.status(200).json({
            message: 'Gramer konusu başarıyla güncellendi',
            grammar
        });
    } catch (error) {
        console.error("updateGrammar error:", error);
        res.status(500).json({ message: "Gramer konusu güncellenirken hata oluştu" });
    }
};

exports.deleteGrammar = async (req, res) => {
    try {
        const { id } = req.params;

        const grammar = await Grammar.findById(id);
        if (!grammar) {
            return res.status(404).json({ message: 'Gramer konusu bulunamadı' });
        }

        // Grammar'ı sil
        await Grammar.findByIdAndDelete(id);
        
        // User favorites'ları da temizle
        await GrammarUserFavorite.deleteMany({ grammarId: id });

        res.status(200).json({
            message: 'Gramer konusu başarıyla silindi'
        });
    } catch (error) {
        console.error("deleteGrammar error:", error);
        res.status(500).json({ message: "Gramer konusu silinirken hata oluştu" });
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        const { categoryName } = req.body;

        if (!categoryName) {
            return res.status(400).json({ message: 'Kategori adı gereklidir' });
        }

        // Önce silinecek grammar ID'lerini al
        const grammarsToDelete = await Grammar.find({ category: categoryName });
        const deletedGrammarIds = grammarsToDelete.map(g => g._id);
        
        // Kategoriyi kullanan tüm gramer konularını sil
        const result = await Grammar.deleteMany({ category: categoryName });
        
        // User favorites'ları da temizle (ilgili grammar'lar silindiği için)
        if (deletedGrammarIds.length > 0) {
            await GrammarUserFavorite.deleteMany({ grammarId: { $in: deletedGrammarIds } });
        }

        res.status(200).json({
            message: `Kategori ve ${result.deletedCount} gramer konusu başarıyla silindi`,
            deletedCount: result.deletedCount
        });
    } catch (error) {
        console.error("deleteCategory error:", error);
        res.status(500).json({ message: "Kategori silinirken hata oluştu" });
    }
};

