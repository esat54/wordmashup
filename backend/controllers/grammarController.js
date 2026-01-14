const Grammar = require('../models/grammarModel');

exports.getAllGrammars = async (req, res) => {
    try {
        const { category, search } = req.query;
        const userId = req.userId;

        let query = {
            addedBy: userId
        };

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

        const pinnedGrammars = grammars.filter(g => g.isPinned);
        const unpinnedGrammars = grammars.filter(g => !g.isPinned);
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

exports.getGlobalGrammars = async (req, res) => {
    try {
        const grammars = await Grammar.find({ isGlobal: true }).sort({ createdAt: -1 });
        res.status(200).json({ grammars });
    } catch (error) {
        console.error("getGlobalGrammars error:", error);
        res.status(500).json({ message: "Hazır gramer konuları getirilirken hata oluştu" });
    }
};

exports.getGrammarById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;

        const grammar = await Grammar.findOne({
            _id: id,
            $or: [
                { addedBy: userId },
                { isGlobal: true }  
            ]
        });

        if (!grammar) {
            return res.status(404).json({ message: 'Gramer konusu bulunamadı' });
        }

        res.status(200).json(grammar);
    } catch (error) {
        console.error("getGrammarById error:", error);
        res.status(500).json({ message: "Gramer konusu getirilirken hata oluştu" });
    }
};

exports.togglePin = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;

        const grammar = await Grammar.findOne({
            _id: id,
            addedBy: userId
        });

        if (!grammar) {
            return res.status(404).json({ message: 'Gramer konusu bulunamadı' });
        }

        grammar.isPinned = !grammar.isPinned;
        await grammar.save();

        res.status(200).json({
            message: grammar.isPinned ? 'Sabitlendi' : 'Sabit kaldırıldı',
            isPinned: grammar.isPinned
        });
    } catch (error) {
        console.error("togglePin error:", error);
        res.status(500).json({ message: "Sabitleme işlemi sırasında hata oluştu" });
    }
};

exports.getCategories = async (req, res) => {
    try {
        const userId = req.userId;
        const categories = await Grammar.distinct("category", { addedBy: userId });
        res.status(200).json({ categories });
    } catch (error) {
        console.error("getCategories error:", error);
        res.status(500).json({ message: "Kategoriler getirilirken hata oluştu" });
    }
};

exports.createGrammar = async (req, res) => {
    try {
        const { category, title, description, formula, rules, notes, examples, isGlobal } = req.body;
        const userId = req.userId;

        if (isGlobal === true && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Sadece adminler global içerik ekleyebilir.' });
        }

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
            examples: examples || [],
            addedBy: userId,
            isGlobal: req.user.role === 'admin' ? (isGlobal || false) : false
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
        const userId = req.userId;

        const grammar = await Grammar.findOne({
            _id: id,
            addedBy: userId
        });

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
        const userId = req.userId;

        const grammar = await Grammar.findOne({
            _id: id,
            addedBy: userId
        });

        if (!grammar) {
            return res.status(404).json({ message: 'Gramer konusu bulunamadı' });
        }

        await Grammar.findByIdAndDelete(id);

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
        const userId = req.userId;

        if (!categoryName) {
            return res.status(400).json({ message: 'Kategori adı gereklidir' });
        }

        // Kullanıcının bu kategorideki tüm gramer konularını sil
        const result = await Grammar.deleteMany({
            category: categoryName,
            addedBy: userId
        });

        res.status(200).json({
            message: `Kategori ve ${result.deletedCount} gramer konusu başarıyla silindi`,
            deletedCount: result.deletedCount
        });
    } catch (error) {
        console.error("deleteCategory error:", error);
        res.status(500).json({ message: "Kategori silinirken hata oluştu" });
    }
};