--
-- PostgreSQL database dump
--

\restrict FHGJ7UwXERLWAf7NPZUfdwa4LCKyyIBK6SfUGW4NWbxnywKDerxOoIk5qS6EF6t

-- Dumped from database version 14.19 (Homebrew)
-- Dumped by pg_dump version 14.19 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: User; Type: TABLE; Schema: public; Owner: esat
--

CREATE TABLE public."User" (
    "userId" integer NOT NULL,
    username text NOT NULL,
    useremail text NOT NULL,
    userpassword text NOT NULL,
    usercreateddate timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."User" OWNER TO esat;

--
-- Name: User_userId_seq; Type: SEQUENCE; Schema: public; Owner: esat
--

CREATE SEQUENCE public."User_userId_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."User_userId_seq" OWNER TO esat;

--
-- Name: User_userId_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: esat
--

ALTER SEQUENCE public."User_userId_seq" OWNED BY public."User"."userId";


--
-- Name: Word; Type: TABLE; Schema: public; Owner: esat
--

CREATE TABLE public."Word" (
    "wordId" integer NOT NULL,
    "userId" integer NOT NULL,
    word text NOT NULL,
    meaning text NOT NULL,
    wordnotes text,
    wordcreateddate timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    isfavorite boolean DEFAULT false NOT NULL
);


ALTER TABLE public."Word" OWNER TO esat;

--
-- Name: Word_wordId_seq; Type: SEQUENCE; Schema: public; Owner: esat
--

CREATE SEQUENCE public."Word_wordId_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Word_wordId_seq" OWNER TO esat;

--
-- Name: Word_wordId_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: esat
--

ALTER SEQUENCE public."Word_wordId_seq" OWNED BY public."Word"."wordId";


--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: esat
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO esat;

--
-- Name: User userId; Type: DEFAULT; Schema: public; Owner: esat
--

ALTER TABLE ONLY public."User" ALTER COLUMN "userId" SET DEFAULT nextval('public."User_userId_seq"'::regclass);


--
-- Name: Word wordId; Type: DEFAULT; Schema: public; Owner: esat
--

ALTER TABLE ONLY public."Word" ALTER COLUMN "wordId" SET DEFAULT nextval('public."Word_wordId_seq"'::regclass);


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: esat
--

COPY public."User" ("userId", username, useremail, userpassword, usercreateddate) FROM stdin;
1	esat	esatsprx77@gmail.com	$2b$10$Hrh/mVAgIgAlpm.jgQeLAesnKKxOL5Z.ej6tvoJftkeJBw26FyiSy	2025-09-14 20:23:27.064
2	user	esatsprx04@gmail.com	$2b$10$m6fngGud50dl9L1EtlAp5eDqnfBHw5LgL4H/Pi5B4S8862DL14EZC	2025-09-18 17:07:07.201
3	user2	user2@gmail.com	$2b$10$8ARWKKcDobzZOglWOkY.HeOEfMu6PO..830ZSUNu77jQNefnBr4Qq	2025-09-18 17:36:05.797
4	user3	user3@gmail.com	$2b$10$MbN6RQbZOrUNqceJqVLmyusAQ2H1nEvsPK5vp5ALdUJeN.VI3EGKi	2025-09-18 17:40:47.085
5	user4	user4@gmail.com	$2b$10$CsW.3xPsGksNUkvSRhaIxum7F0S9YgvMeEZ6y7D36OL2mEiq8AgUa	2025-09-18 17:50:48.928
6	user5	user5@gmail.com	$2b$10$QfYwTB133yNcgNlt60kzZuudzZw.rWVUa7Vo/6SYMLMd1bTadAII6	2025-09-18 18:07:36.705
7	user7	user7@gmail.com	$2b$10$qRxYJlfu2Df7zXdbG7Mzn.poBvXXf2HCkJTc0SmQ98/tefy/.T0TS	2025-09-18 18:08:14.548
\.


--
-- Data for Name: Word; Type: TABLE DATA; Schema: public; Owner: esat
--

COPY public."Word" ("wordId", "userId", word, meaning, wordnotes, wordcreateddate, isfavorite) FROM stdin;
140	3	serwer	werwer	ewrwer	2025-09-18 20:53:53.844	t
139	3	ability	yetenek		2025-09-18 20:53:08.698	t
141	1	18 perşembe	dfgdfg		2025-09-18 20:59:27.689	f
142	1	19 cuma	sddg		2025-09-18 21:03:56.126	f
143	1	sdfgdf	dfgdfg		2025-09-19 06:08:28.224	f
144	1	ability	yetenek		2025-09-19 06:29:12.578	f
145	1	journey	seyehat	dfgdfgadfgadfg	2025-09-19 06:29:36.371	f
127	1	dün	dün	\N	2025-09-17 15:43:56.799	t
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: esat
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
cba12028-e508-484f-b9ca-15777322bb9e	b390d23b7a6750df6b271d788706d7acc46a7ba599863849570973eca216c94d	2025-09-12 13:02:01.550372+03	20250912100201_init_db	\N	\N	2025-09-12 13:02:01.543943+03	1
9c7eed0c-7cf9-468b-9c65-d757505989a9	9b3cd6e0c2869a2c8f52f93d0d563b284f2bac9642cab04be3ebd7061055aa45	2025-09-14 15:55:41.14833+03	20250914125541_init_db	\N	\N	2025-09-14 15:55:41.140449+03	1
\.


--
-- Name: User_userId_seq; Type: SEQUENCE SET; Schema: public; Owner: esat
--

SELECT pg_catalog.setval('public."User_userId_seq"', 7, true);


--
-- Name: Word_wordId_seq; Type: SEQUENCE SET; Schema: public; Owner: esat
--

SELECT pg_catalog.setval('public."Word_wordId_seq"', 145, true);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: esat
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY ("userId");


--
-- Name: Word Word_pkey; Type: CONSTRAINT; Schema: public; Owner: esat
--

ALTER TABLE ONLY public."Word"
    ADD CONSTRAINT "Word_pkey" PRIMARY KEY ("wordId");


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: esat
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: User_useremail_key; Type: INDEX; Schema: public; Owner: esat
--

CREATE UNIQUE INDEX "User_useremail_key" ON public."User" USING btree (useremail);


--
-- Name: User_username_key; Type: INDEX; Schema: public; Owner: esat
--

CREATE UNIQUE INDEX "User_username_key" ON public."User" USING btree (username);


--
-- Name: Word Word_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: esat
--

ALTER TABLE ONLY public."Word"
    ADD CONSTRAINT "Word_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"("userId") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- PostgreSQL database dump complete
--

\unrestrict FHGJ7UwXERLWAf7NPZUfdwa4LCKyyIBK6SfUGW4NWbxnywKDerxOoIk5qS6EF6t

