import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function createWord({ word, meaning, note, userId }) {
    return await prisma.word.create({
        data: { word, meaning, wordnotes: note, userId },
    });
}

export async function getWordsByUserId(userId) {
    return await prisma.word.findMany({
        where: { userId },
    });
}

export async function getTodayWordCount(userId) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    return await prisma.word.count({
        where: {
            userId: userId,
            wordcreateddate: {
                gte: today,
                lt: tomorrow
            }
        }
    });
}


export async function deleteWord(wordId, userId) {
    return await prisma.word.deleteMany({
        where: {
            wordId: parseInt(wordId), // wordId'yi integer'a dönüştürmeyi unutma
            userId: userId, // Güvenlik için kullanıcının kendi kelimesini sildiğinden emin ol
        },
    });
}

export async function toggleFavorite(wordId, userId) {
    const word = await prisma.word.findFirst({
        where: {
            wordId: parseInt(wordId),
            userId: userId,
        },
    });

    if (!word) {
        throw new Error('Kelime bulunamadı veya yetkiniz yok.');
    }

    return await prisma.word.update({
        where: {
            wordId: parseInt(wordId),
        },
        data: {
            isfavorite: !word.isfavorite, // isfavorite değerini tersine çevir
        },
    });
}