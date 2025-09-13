-- CreateTable
CREATE TABLE "public"."User" (
    "userId" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "useremail" TEXT NOT NULL,
    "userpassword" TEXT NOT NULL,
    "usercreateddate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "public"."Word" (
    "wordId" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "word" TEXT NOT NULL,
    "meaning" TEXT NOT NULL,
    "wordnotes" TEXT,
    "wordcreateddate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isfavorite" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Word_pkey" PRIMARY KEY ("wordId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_useremail_key" ON "public"."User"("useremail");

-- AddForeignKey
ALTER TABLE "public"."Word" ADD CONSTRAINT "Word_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
