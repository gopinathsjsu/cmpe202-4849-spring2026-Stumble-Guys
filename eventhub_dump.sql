--
-- PostgreSQL database dump
--

\restrict Wb7E8XQ8ELIaC316f0xW8aB91PSdazWQnFr1lA5Q491wBg9gT3hoM1pEkQmy4Pq

-- Dumped from database version 15.17 (Homebrew)
-- Dumped by pg_dump version 15.17 (Homebrew)

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
-- Name: categories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.categories (
    id uuid NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    icon text
);


--
-- Name: event_updates; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.event_updates (
    id uuid NOT NULL,
    event_id uuid NOT NULL,
    author_id uuid NOT NULL,
    message text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: event_views; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.event_views (
    id uuid NOT NULL,
    event_id uuid NOT NULL,
    user_id uuid,
    ip_address text,
    viewed_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: events; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.events (
    id uuid NOT NULL,
    organizer_id uuid NOT NULL,
    category_id uuid,
    title text NOT NULL,
    slug text NOT NULL,
    description text NOT NULL,
    short_desc text,
    start_date timestamp(3) without time zone NOT NULL,
    end_date timestamp(3) without time zone NOT NULL,
    timezone text DEFAULT 'America/Los_Angeles'::text NOT NULL,
    venue_name text,
    address text,
    city text,
    state text,
    zip_code text,
    country text DEFAULT 'US'::text NOT NULL,
    latitude numeric(10,7),
    longitude numeric(10,7),
    is_online boolean DEFAULT false NOT NULL,
    online_url text,
    image_url text,
    capacity integer DEFAULT 100 NOT NULL,
    is_free boolean DEFAULT true NOT NULL,
    price numeric(10,2) DEFAULT 0 NOT NULL,
    status text DEFAULT 'draft'::text NOT NULL,
    approval_notes text,
    approved_by_id uuid,
    approved_at timestamp(3) without time zone,
    tags text[],
    schedule jsonb,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    google_maps_url text
);


--
-- Name: notifications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.notifications (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    event_id uuid,
    type text NOT NULL,
    title text NOT NULL,
    message text NOT NULL,
    is_read boolean DEFAULT false NOT NULL,
    channel text DEFAULT 'in_app'::text NOT NULL,
    sent_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: refresh_tokens; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.refresh_tokens (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    token text NOT NULL,
    expires_at timestamp(3) without time zone NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: rsvps; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.rsvps (
    id uuid NOT NULL,
    event_id uuid NOT NULL,
    user_id uuid NOT NULL,
    status text DEFAULT 'going'::text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    approval_status text DEFAULT 'not_required'::text NOT NULL
);


--
-- Name: saved_events; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.saved_events (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    event_id uuid NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: ticket_types; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ticket_types (
    id uuid NOT NULL,
    event_id uuid NOT NULL,
    name text NOT NULL,
    price numeric(10,2) DEFAULT 0 NOT NULL,
    quantity integer NOT NULL,
    sold_count integer DEFAULT 0 NOT NULL,
    description text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: tickets; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tickets (
    id uuid NOT NULL,
    ticket_type_id uuid NOT NULL,
    event_id uuid NOT NULL,
    user_id uuid NOT NULL,
    ticket_number text NOT NULL,
    status text DEFAULT 'confirmed'::text NOT NULL,
    qr_code text,
    purchase_date timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    amount_paid numeric(10,2) DEFAULT 0 NOT NULL,
    payment_status text DEFAULT 'completed'::text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id uuid NOT NULL,
    email text NOT NULL,
    password_hash text NOT NULL,
    first_name text NOT NULL,
    last_name text NOT NULL,
    role text DEFAULT 'attendee'::text NOT NULL,
    avatar_url text,
    phone text,
    bio text,
    is_verified boolean DEFAULT false NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    google_calendar_refresh_token text
);


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.categories (id, name, slug, icon) FROM stdin;
27bea48e-671b-4a53-8dbd-5e5302a03c16	Music	music	music
a413cb3d-4a15-495a-b0c3-8147a49d0fd0	Technology	technology	cpu
b338f833-7ff4-4dc2-9af4-0b1c706bd99f	Business	business	briefcase
bc0ab55f-47da-4bb3-981b-7ea2932ed96a	Food & Drink	food-and-drink	utensils
97803d88-5bf0-41d1-a6ba-06b3a65f5fd5	Arts	arts	palette
a7d7be6b-12b2-4d4c-9186-b67090b4a18b	Sports & Fitness	sports-and-fitness	dumbbell
51ad8c9b-f272-463b-903a-e2f3a8013af5	Health	health	heart-pulse
1c8066a4-0fc4-4a6a-906d-8a662618a774	Community	community	users
f7ae52cf-11e7-4a7c-ad95-183407fbe449	Education	education	graduation-cap
43df6b28-82e2-44ab-9db1-98e5e9d66081	Charity	charity	hand-heart
\.


--
-- Data for Name: event_updates; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.event_updates (id, event_id, author_id, message, created_at) FROM stdin;
\.


--
-- Data for Name: event_views; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.event_views (id, event_id, user_id, ip_address, viewed_at) FROM stdin;
\.


--
-- Data for Name: events; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.events (id, organizer_id, category_id, title, slug, description, short_desc, start_date, end_date, timezone, venue_name, address, city, state, zip_code, country, latitude, longitude, is_online, online_url, image_url, capacity, is_free, price, status, approval_notes, approved_by_id, approved_at, tags, schedule, created_at, updated_at, google_maps_url) FROM stdin;
d172efba-7f39-4cb0-af7b-ffd23d22cf8a	ecf9e6ba-edc3-4194-8e8f-1166e432d4db	27bea48e-671b-4a53-8dbd-5e5302a03c16	Electronic Music Festival	electronic-music-festival-2026	Two-day electronic music festival at Shoreline Amphitheatre featuring top DJs and producers from around the world. Multiple stages, food trucks, and art installations.	Two-day EDM festival at Shoreline Amphitheatre.	2026-07-08 23:56:00.819	2026-07-10 07:56:00.819	America/Los_Angeles	Shoreline Amphitheatre	1 Amphitheatre Pkwy	Mountain View	CA	94043	US	37.4267000	-122.0806000	f	\N	https://images.unsplash.com/photo-1470225620780-dba8ba36b745	15000	f	150.00	approved	\N	\N	\N	{edm,festival,electronic,dj}	\N	2026-05-09 23:56:00.826	2026-05-10 19:51:08.989	\N
a7b52b47-7a9c-4984-a304-6a91f33e3ee0	326cab9a-52d9-47d9-b8ca-ddc0657ad122	27bea48e-671b-4a53-8dbd-5e5302a03c16	Acoustic Open Mic Night	acoustic-open-mic-night-sj	Monthly open mic night at San Pedro Square Market. Sign up to perform or just come to enjoy the talent. All acoustic instruments welcome.	Monthly open mic night for acoustic performers.	2026-04-29 23:56:00.819	2026-04-30 02:56:00.819	America/Los_Angeles	San Pedro Square Market	87 N San Pedro St	San Jose	CA	95110	US	37.3365000	-121.8944000	f	\N	https://images.unsplash.com/photo-1516450360452-9312f5e86fc7	100	t	0.00	completed	\N	\N	\N	{open-mic,acoustic,local}	\N	2026-05-09 23:56:00.828	2026-05-10 19:51:08.99	\N
fb8fa0f6-b1a4-40e5-a3e4-443c32c3273e	ecf9e6ba-edc3-4194-8e8f-1166e432d4db	a413cb3d-4a15-495a-b0c3-8147a49d0fd0	React & Next.js Developer Meetup	react-nextjs-meetup-mv-2026	Monthly developer meetup at the Computer History Museum. This month we cover React Server Components, Next.js App Router patterns, and building performant web apps.	Monthly meetup for React and Next.js developers.	2026-05-16 23:56:00.819	2026-05-17 02:56:00.819	America/Los_Angeles	Computer History Museum	1401 N Shoreline Blvd	Mountain View	CA	94043	US	37.4143000	-122.0777000	f	\N	https://images.unsplash.com/photo-1633356122544-f134324a6cee	150	t	0.00	approved	\N	\N	\N	{react,nextjs,javascript,meetup,web-dev}	\N	2026-05-09 23:56:00.83	2026-05-10 19:51:08.99	\N
c97c5d27-0bf2-48a4-ba4e-b9ac8f7530b0	326cab9a-52d9-47d9-b8ca-ddc0657ad122	a413cb3d-4a15-495a-b0c3-8147a49d0fd0	Women in Tech Conference	women-in-tech-conf-2026	A full-day conference celebrating women in technology. Featuring keynotes from industry leaders, mentorship sessions, career workshops, and a hiring fair.	Conference celebrating and empowering women in tech.	2026-05-30 23:56:00.819	2026-05-31 08:56:00.819	America/Los_Angeles	Santa Clara Convention Center	5001 Great America Pkwy	Santa Clara	CA	95054	US	37.4041000	-121.9757000	f	\N	https://images.unsplash.com/photo-1573164713714-d95e436ab8d6	800	f	75.00	approved	\N	\N	\N	{women-in-tech,diversity,conference,career}	\N	2026-05-09 23:56:00.831	2026-05-10 19:51:08.991	\N
c2c88104-be03-4655-944a-30d09b4287b9	326cab9a-52d9-47d9-b8ca-ddc0657ad122	b338f833-7ff4-4dc2-9af4-0b1c706bd99f	Bay Area Entrepreneurs Networking Mixer	ba-entrepreneurs-mixer-2026	Connect with fellow entrepreneurs, investors, and startup founders at this casual networking mixer. Complimentary drinks and appetizers included.	Networking mixer for entrepreneurs and investors.	2026-05-19 23:56:00.819	2026-05-20 02:56:00.819	America/Los_Angeles	San Pedro Square Market	87 N San Pedro St	San Jose	CA	95110	US	37.3365000	-121.8944000	f	\N	https://images.unsplash.com/photo-1556761175-5973dc0f32e7	120	f	25.00	approved	\N	\N	\N	{networking,entrepreneurs,startups,business}	\N	2026-05-09 23:56:00.832	2026-05-10 19:51:08.991	\N
07bf468e-3ca0-4b6a-8111-36104e94d667	ecf9e6ba-edc3-4194-8e8f-1166e432d4db	b338f833-7ff4-4dc2-9af4-0b1c706bd99f	Venture Capital Pitch Night	vc-pitch-night-pa-2026	Ten pre-selected startups pitch to a panel of top-tier VC firms. Audience voting determines the People's Choice winner. Great opportunity to see the next big ideas.	Startups pitch to top VCs for funding.	2026-05-27 23:56:00.819	2026-05-28 03:56:00.819	America/Los_Angeles	Mitchell Park Community Center	3700 Middlefield Rd	Palo Alto	CA	94303	US	37.4129000	-122.1036000	f	\N	https://images.unsplash.com/photo-1559523182-a284c3fb7cff	250	f	40.00	approved	\N	ccfb3f1d-0ffe-4eaa-971e-66adc11df4d5	2026-05-10 23:38:22.957	{vc,pitch,startups,investment}	\N	2026-05-09 23:56:00.833	2026-05-10 23:38:22.958	\N
2b07fc79-e45c-44c9-a307-a6534662cba4	326cab9a-52d9-47d9-b8ca-ddc0657ad122	b338f833-7ff4-4dc2-9af4-0b1c706bd99f	Digital Marketing Masterclass	digital-marketing-masterclass-2026	Full-day intensive workshop covering SEO, social media strategy, content marketing, paid advertising, and analytics. Hands-on exercises with real-world campaigns.	Hands-on digital marketing workshop.	2026-04-24 23:56:00.819	2026-04-25 07:56:00.819	America/Los_Angeles	Sunnyvale Community Center	550 E Remington Dr	Sunnyvale	CA	94087	US	37.3517000	-122.0119000	f	\N	https://images.unsplash.com/photo-1460925895917-afdab827c52f	60	f	120.00	completed	\N	\N	\N	{marketing,digital,workshop,seo}	\N	2026-05-09 23:56:00.834	2026-05-10 19:51:08.987	\N
1cfec7ff-898a-4816-93f0-38df61413e27	326cab9a-52d9-47d9-b8ca-ddc0657ad122	27bea48e-671b-4a53-8dbd-5e5302a03c16	Sunnyvale Summer Concert Series	sunnyvale-summer-concert-2026	Free outdoor concert series at Murphy Park featuring indie rock, folk, and pop acts every Saturday through the summer. Bring your blankets and picnic baskets!	Free outdoor concerts every Saturday at Murphy Park.	2026-06-08 23:56:00.819	2026-06-09 02:56:00.819	America/Los_Angeles	Murphy Park	250 N Sunnyvale Ave	Sunnyvale	CA	94085	US	37.3811000	-122.0274000	f	\N	https://images.unsplash.com/photo-1459749411175-04bf5292ceea	2000	t	0.00	approved	\N	\N	\N	{concert,outdoor,free,family-friendly}	\N	2026-05-09 23:56:00.825	2026-05-10 19:51:08.988	\N
34ecd42f-cf58-4446-9677-15c75cc21718	ecf9e6ba-edc3-4194-8e8f-1166e432d4db	a413cb3d-4a15-495a-b0c3-8147a49d0fd0	Startup Weekend San Jose	startup-weekend-sj-2026	A 54-hour weekend event where developers, designers, and business minds come together to pitch ideas, form teams, and launch startups. Prizes for top 3 teams.	54-hour startup building competition.	2026-04-09 23:56:00.819	2026-04-12 07:56:00.819	America/Los_Angeles	San Jose Convention Center	150 W San Carlos St	San Jose	CA	95113	US	37.3296000	-121.8880000	f	\N	https://images.unsplash.com/photo-1559136555-9303baea8ebd	200	f	50.00	completed	\N	\N	\N	{startup,hackathon,entrepreneurship}	\N	2026-05-09 23:56:00.832	2026-05-10 19:51:08.988	\N
b3bb968f-c020-4544-9587-a4f32da93a18	326cab9a-52d9-47d9-b8ca-ddc0657ad122	97803d88-5bf0-41d1-a6ba-06b3a65f5fd5	Photography Exhibition: Urban Landscapes	photography-urban-landscapes-2026	A curated exhibition of urban landscape photography by 12 Bay Area photographers. Opening reception with artist talks and refreshments.	Urban photography exhibition by Bay Area artists.	2026-04-19 23:56:00.819	2026-04-20 03:56:00.819	America/Los_Angeles	San Jose Museum of Art	110 S Market St	San Jose	CA	95113	US	37.3337000	-121.8907000	f	\N	https://images.unsplash.com/photo-1506905925346-21bda4d32df4	200	t	0.00	completed	\N	\N	\N	{photography,exhibition,urban,art}	\N	2026-05-09 23:56:00.84	2026-05-10 19:51:08.992	\N
6906dbb4-e860-4b46-98de-5f47f657446d	ecf9e6ba-edc3-4194-8e8f-1166e432d4db	a7d7be6b-12b2-4d4c-9186-b67090b4a18b	San Jose 10K Run for Charity	sj-10k-charity-run-2026	Annual 10K charity run through downtown San Jose. All proceeds go to local youth sports programs. Finishers receive a medal and event t-shirt.	10K charity run through downtown San Jose.	2026-06-13 23:56:00.819	2026-06-14 03:56:00.819	America/Los_Angeles	San Jose Convention Center	150 W San Carlos St	San Jose	CA	95113	US	37.3296000	-121.8880000	f	\N	https://images.unsplash.com/photo-1452626038306-9aae5e071dd3	2000	f	45.00	approved	\N	\N	\N	{running,10k,charity,fitness}	\N	2026-05-09 23:56:00.841	2026-05-10 19:51:08.993	\N
0691332a-c040-47e5-81d4-038fec940b13	326cab9a-52d9-47d9-b8ca-ddc0657ad122	a7d7be6b-12b2-4d4c-9186-b67090b4a18b	Outdoor Yoga in the Park	outdoor-yoga-golden-gate-2026	Free outdoor yoga session in Golden Gate Park led by certified instructors. All levels welcome. Bring your own mat and water.	Free yoga session at Golden Gate Park.	2026-05-14 23:56:00.819	2026-05-15 01:56:00.819	America/Los_Angeles	Golden Gate Park	501 Stanyan St	San Francisco	CA	94117	US	37.7694000	-122.4862000	f	\N	https://images.unsplash.com/photo-1544367567-0f2fcb009e0b	200	t	0.00	approved	\N	\N	\N	{yoga,outdoor,fitness,free,park}	\N	2026-05-09 23:56:00.842	2026-05-10 19:51:08.993	\N
5738c771-8041-4191-839f-767d8711d766	ecf9e6ba-edc3-4194-8e8f-1166e432d4db	a7d7be6b-12b2-4d4c-9186-b67090b4a18b	CrossFit Community Challenge	crossfit-challenge-sc-2026	Team-based CrossFit competition open to all fitness levels. Form a team of 4 and compete in modified WODs. Great atmosphere, food vendors, and prizes.	Team CrossFit competition for all levels.	2026-05-02 23:56:00.819	2026-05-03 05:56:00.819	America/Los_Angeles	Levi's Stadium	4900 Marie P DeBartolo Way	Santa Clara	CA	95054	US	37.4033000	-121.9695000	f	\N	https://images.unsplash.com/photo-1534438327276-14e5300c3a48	300	f	30.00	completed	\N	\N	\N	{crossfit,competition,fitness,team}	\N	2026-05-09 23:56:00.842	2026-05-10 19:51:08.993	\N
59434da7-65f3-4772-befe-5397ca143b26	326cab9a-52d9-47d9-b8ca-ddc0657ad122	51ad8c9b-f272-463b-903a-e2f3a8013af5	Mental Health Awareness Workshop	mental-health-workshop-2026	Interactive workshop covering stress management, mindfulness techniques, and building emotional resilience. Led by licensed therapists and wellness coaches.	Workshop on stress management and mindfulness.	2026-05-29 23:56:00.819	2026-05-30 03:56:00.819	America/Los_Angeles	Mitchell Park Community Center	3700 Middlefield Rd	Palo Alto	CA	94303	US	37.4129000	-122.1036000	f	\N	https://images.unsplash.com/photo-1506126613408-eca07ce68773	80	t	0.00	approved	\N	\N	\N	{mental-health,wellness,mindfulness,workshop}	\N	2026-05-09 23:56:00.843	2026-05-10 19:51:08.994	\N
d56761da-f672-4b5d-85c5-d338f70f763f	326cab9a-52d9-47d9-b8ca-ddc0657ad122	51ad8c9b-f272-463b-903a-e2f3a8013af5	Guided Meditation Retreat	meditation-retreat-cupertino-2026	Half-day meditation retreat with guided sessions, breathwork, sound healing, and a vegetarian lunch. Perfect for beginners and experienced meditators alike.	Half-day guided meditation retreat.	2026-05-06 23:56:00.819	2026-05-07 04:56:00.819	America/Los_Angeles	Quinlan Community Center	10185 N Stelling Rd	Cupertino	CA	95014	US	37.3281000	-122.0457000	f	\N	https://images.unsplash.com/photo-1508672019048-805c876b67e2	35	f	55.00	completed	\N	\N	\N	{meditation,retreat,mindfulness,sound-healing}	\N	2026-05-09 23:56:00.845	2026-05-10 19:51:08.995	\N
9cd65740-db70-43a9-acd0-fc109be876e8	ecf9e6ba-edc3-4194-8e8f-1166e432d4db	bc0ab55f-47da-4bb3-981b-7ea2932ed96a	Wine Tasting: California Pinot Noirs	california-pinot-noir-tasting-2026	Explore 15 exceptional Pinot Noirs from California's top wine regions. Expert sommeliers guide you through tasting notes and food pairing recommendations.	Guided tasting of 15 California Pinot Noirs.	2026-05-21 23:56:00.819	2026-05-22 02:56:00.819	America/Los_Angeles	Fort Mason Center	2 Marina Blvd	San Francisco	CA	94123	US	37.8064000	-122.4315000	f	\N	https://images.unsplash.com/photo-1510812431401-41d2bd2722f3	40	f	65.00	approved	\N	\N	\N	{wine,tasting,pinot-noir,california}	\N	2026-05-09 23:56:00.836	2026-05-10 19:51:08.995	\N
411b6e28-133c-43ed-8255-767bcf6f2b85	326cab9a-52d9-47d9-b8ca-ddc0657ad122	bc0ab55f-47da-4bb3-981b-7ea2932ed96a	Sushi Making Workshop	sushi-making-workshop-2026	Learn the art of sushi making from Chef Tanaka. You'll master nigiri, maki rolls, and temaki. All ingredients and tools provided. Take home your creations!	Hands-on sushi making class with Chef Tanaka.	2026-05-04 23:56:00.819	2026-05-05 02:56:00.819	America/Los_Angeles	Quinlan Community Center	10185 N Stelling Rd	Cupertino	CA	95014	US	37.3281000	-122.0457000	f	\N	https://images.unsplash.com/photo-1579871494447-9811cf80d66c	20	f	85.00	completed	\N	\N	\N	{sushi,cooking,workshop,japanese}	\N	2026-05-09 23:56:00.837	2026-05-10 19:51:08.995	\N
52c1f25a-715e-40c0-a209-8e1e31271870	326cab9a-52d9-47d9-b8ca-ddc0657ad122	97803d88-5bf0-41d1-a6ba-06b3a65f5fd5	South Bay Art Walk & Gallery Night	south-bay-art-walk-2026	Self-guided art walk through downtown San Jose galleries and studios. Over 30 artists showcase their work with live demonstrations, interactive installations, and pop-up shops.	Art walk through 30+ galleries in downtown San Jose.	2026-05-17 23:56:00.819	2026-05-18 04:56:00.819	America/Los_Angeles	San Jose Museum of Art	110 S Market St	San Jose	CA	95113	US	37.3337000	-121.8907000	f	\N	https://images.unsplash.com/photo-1513364776144-60967b0f800f	1000	t	0.00	approved	\N	\N	\N	{art,gallery,art-walk,downtown}	\N	2026-05-09 23:56:00.838	2026-05-10 19:51:08.996	\N
02b07105-7cf1-4dd4-bb1b-344b5d336478	ecf9e6ba-edc3-4194-8e8f-1166e432d4db	97803d88-5bf0-41d1-a6ba-06b3a65f5fd5	Watercolor Painting Workshop	watercolor-workshop-pa-2026	Beginner-friendly watercolor painting workshop at the Palo Alto Art Center. All materials provided. Learn techniques for landscapes, florals, and abstract art.	Beginner watercolor workshop at Palo Alto Art Center.	2026-05-25 23:56:00.819	2026-05-26 03:56:00.819	America/Los_Angeles	Palo Alto Art Center	1313 Newell Rd	Palo Alto	CA	94303	US	37.4443000	-122.1378000	f	\N	https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b	30	f	45.00	approved	\N	\N	\N	{watercolor,painting,workshop,beginner}	\N	2026-05-09 23:56:00.839	2026-05-10 19:51:08.992	\N
d85c5e53-d378-4a0f-9251-a3fc4a9c725a	ecf9e6ba-edc3-4194-8e8f-1166e432d4db	51ad8c9b-f272-463b-903a-e2f3a8013af5	Nutrition & Meal Prep Seminar	nutrition-meal-prep-seminar-2026	Learn how to plan and prep healthy meals for the week. Registered dietitian covers macros, portion control, budget-friendly shopping, and quick recipes.	Healthy meal planning and prep seminar.	2026-06-06 23:56:00.819	2026-06-07 02:56:00.819	America/Los_Angeles	Sunnyvale Community Center	550 E Remington Dr	Sunnyvale	CA	94087	US	37.3517000	-122.0119000	f	\N	https://images.unsplash.com/photo-1490645935967-10de6ba17061	50	f	20.00	approved	\N	ccfb3f1d-0ffe-4eaa-971e-66adc11df4d5	2026-05-10 23:38:20.274	{nutrition,meal-prep,health,diet}	\N	2026-05-09 23:56:00.844	2026-05-10 23:38:20.274	\N
2d41214e-687e-4af0-972d-5b1752745562	ecf9e6ba-edc3-4194-8e8f-1166e432d4db	a413cb3d-4a15-495a-b0c3-8147a49d0fd0	Remote Work Best Practices Webinar	remote-work-webinar-2026	Learn from leaders at fully remote companies about productivity tools, async communication, work-life balance, and building culture in distributed teams.	Webinar on remote work productivity and culture.	2026-05-15 23:56:00.819	2026-05-16 01:56:00.819	America/Los_Angeles	Online - Zoom					US	\N	\N	t	https://zoom.us/j/example-remote-work	https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b	500	t	0.00	approved	\N	\N	\N	{remote-work,webinar,productivity,online}	\N	2026-05-09 23:56:00.853	2026-05-09 23:56:00.853	\N
14402a1b-247f-4b46-a573-2169ecb7e00b	326cab9a-52d9-47d9-b8ca-ddc0657ad122	f7ae52cf-11e7-4a7c-ad95-183407fbe449	Creative Writing Online Workshop	creative-writing-online-2026	Six-week online creative writing workshop covering short fiction, poetry, and personal essays. Weekly live sessions with peer feedback and instructor review.	Online creative writing workshop series.	2026-05-20 23:56:00.819	2026-05-21 01:56:00.819	America/Los_Angeles	Online - Google Meet					US	\N	\N	t	https://meet.google.com/example-writing	https://images.unsplash.com/photo-1455390582262-044cdead277a	25	f	149.00	approved	\N	\N	\N	{writing,creative,online,workshop}	\N	2026-05-09 23:56:00.854	2026-05-09 23:56:00.854	\N
de268477-60b2-45ab-ac2f-da9a1b267613	326cab9a-52d9-47d9-b8ca-ddc0657ad122	43df6b28-82e2-44ab-9db1-98e5e9d66081	Gala Dinner: Homes for All	homes-for-all-gala-2026	Annual charity gala dinner supporting affordable housing initiatives in the Bay Area. Silent auction, live entertainment, keynote by local housing advocates.	Charity gala supporting affordable housing.	2026-07-03 23:56:00.819	2026-07-04 04:56:00.819	America/Los_Angeles	Moscone Center	747 Howard St	San Francisco	CA	94103	US	37.7842000	-122.4016000	f	\N	https://images.unsplash.com/photo-1540575467063-178a50c2df87	400	f	200.00	approved	\N	\N	\N	{charity,gala,housing,fundraiser}	\N	2026-05-09 23:56:00.851	2026-05-10 19:51:08.997	\N
2cf78b12-a368-4b7a-8d21-e426bded960f	ecf9e6ba-edc3-4194-8e8f-1166e432d4db	43df6b28-82e2-44ab-9db1-98e5e9d66081	Charity Dog Walk & Adoption Fair	charity-dog-walk-adoption-2026	Walk your pup and help raise funds for local animal shelters! 3-mile scenic route with water stations, dog treats, vendor booths, and an adoption fair.	Dog walk fundraiser with adoption fair.	2026-05-18 23:56:00.819	2026-05-19 03:56:00.819	America/Los_Angeles	Golden Gate Park	501 Stanyan St	San Francisco	CA	94117	US	37.7694000	-122.4862000	f	\N	https://images.unsplash.com/photo-1548199973-03cce0bbc87b	500	f	15.00	approved	\N	\N	\N	{charity,dogs,adoption,walk,animals}	\N	2026-05-09 23:56:00.852	2026-05-10 19:51:08.997	\N
cb4deeee-eda0-4e25-9204-86cb0be18a4a	326cab9a-52d9-47d9-b8ca-ddc0657ad122	43df6b28-82e2-44ab-9db1-98e5e9d66081	Back-to-School Supply Drive	back-to-school-supply-drive-2026	Help provide school supplies for underprivileged students. Drop off supplies or donate online. Volunteer to help sort and distribute. Every contribution counts!	School supply donation drive for local students.	2026-03-10 23:56:00.819	2026-03-11 05:56:00.819	America/Los_Angeles	Sunnyvale Community Center	550 E Remington Dr	Sunnyvale	CA	94087	US	37.3517000	-122.0119000	f	\N	https://images.unsplash.com/photo-1503676260728-1c00da094a0b	200	t	0.00	completed	\N	\N	\N	{charity,school,donation,community,volunteer}	\N	2026-05-09 23:56:00.852	2026-05-10 19:51:08.997	\N
427568e3-84ab-4ab4-a8e0-ef2a50cddfc3	ecf9e6ba-edc3-4194-8e8f-1166e432d4db	a413cb3d-4a15-495a-b0c3-8147a49d0fd0	Blockchain & Web3 Developer Workshop	blockchain-web3-workshop-2026	Hands-on workshop for developers interested in blockchain technology, smart contracts with Solidity, and building decentralized applications on Ethereum.	Hands-on blockchain and Web3 development workshop.	2026-07-18 23:56:00.819	2026-07-19 07:56:00.819	America/Los_Angeles	Computer History Museum	1401 N Shoreline Blvd	Mountain View	CA	94043	US	37.4143000	-122.0777000	f	\N	https://images.unsplash.com/photo-1639762681057-408e52192e55	50	f	175.00	draft	\N	\N	\N	{blockchain,web3,solidity,ethereum,workshop}	\N	2026-05-09 23:56:00.855	2026-05-10 19:51:08.998	\N
5afdcfa9-56f6-45f2-8353-d210835a8072	326cab9a-52d9-47d9-b8ca-ddc0657ad122	1c8066a4-0fc4-4a6a-906d-8a662618a774	Volunteer Day: Park Cleanup	park-cleanup-volunteer-day-2026	Join us for a community park cleanup day. Gloves, bags, and tools provided. Lunch served for all volunteers. Make a difference in your community!	Community park cleanup volunteer event.	2026-05-12 23:56:00.819	2026-05-13 03:56:00.819	America/Los_Angeles	Golden Gate Park	501 Stanyan St	San Francisco	CA	94117	US	37.7694000	-122.4862000	f	\N	https://images.unsplash.com/photo-1559027615-cd4628902d4a	150	t	0.00	approved	\N	\N	\N	{volunteer,community,park,cleanup}	\N	2026-05-09 23:56:00.846	2026-05-10 19:51:08.998	\N
d9bcead1-664a-4442-b319-64ee76d2de5f	ecf9e6ba-edc3-4194-8e8f-1166e432d4db	f7ae52cf-11e7-4a7c-ad95-183407fbe449	Python for Data Science Bootcamp	python-data-science-bootcamp-2026	Intensive 2-day bootcamp covering Python, pandas, NumPy, matplotlib, and intro to machine learning. Laptops required. Prior programming experience recommended.	2-day Python data science intensive bootcamp.	2026-05-31 23:56:00.819	2026-06-02 07:56:00.819	America/Los_Angeles	Computer History Museum	1401 N Shoreline Blvd	Mountain View	CA	94043	US	37.4143000	-122.0777000	f	\N	https://images.unsplash.com/photo-1526379095098-d400fd0bf935	60	f	199.00	approved	\N	\N	\N	{python,data-science,bootcamp,programming}	[{"time": "9:00 AM", "title": "Setup & Python Refresher", "speaker": ""}, {"time": "10:30 AM", "title": "Data Manipulation with Pandas", "speaker": "Dr. Priya Sharma"}, {"time": "1:00 PM", "title": "Lunch Break", "speaker": ""}, {"time": "2:00 PM", "title": "Data Visualization", "speaker": "Dr. Priya Sharma"}, {"time": "4:00 PM", "title": "Hands-on Project", "speaker": ""}]	2026-05-09 23:56:00.848	2026-05-10 19:51:08.999	\N
ea5525cb-f083-4dfa-a9fc-d5f9b041b1df	326cab9a-52d9-47d9-b8ca-ddc0657ad122	f7ae52cf-11e7-4a7c-ad95-183407fbe449	Public Speaking Masterclass	public-speaking-masterclass-2026	Overcome your fear of public speaking! Full-day workshop with professional speech coach covering body language, storytelling, and presentation design.	Public speaking workshop with professional coach.	2026-05-24 23:56:00.819	2026-05-25 06:56:00.819	America/Los_Angeles	Mitchell Park Community Center	3700 Middlefield Rd	Palo Alto	CA	94303	US	37.4129000	-122.1036000	f	\N	https://images.unsplash.com/photo-1475721027785-f74eccf877e2	40	f	89.00	approved	\N	\N	\N	{public-speaking,workshop,communication,career}	\N	2026-05-09 23:56:00.849	2026-05-10 19:51:08.999	\N
c47f8482-ee31-4ef6-8615-d00a57dccc33	ecf9e6ba-edc3-4194-8e8f-1166e432d4db	f7ae52cf-11e7-4a7c-ad95-183407fbe449	College Prep & SAT Strategy Workshop	college-prep-sat-workshop-2026	Free workshop for high school juniors and seniors. Covers SAT/ACT strategies, college application essays, financial aid, and scholarship opportunities.	Free college prep workshop for high schoolers.	2026-06-28 23:56:00.819	2026-06-29 04:56:00.819	America/Los_Angeles	Mitchell Park Community Center	3700 Middlefield Rd	Palo Alto	CA	94303	US	37.4129000	-122.1036000	f	\N	https://images.unsplash.com/photo-1523050854058-8df90110c476	100	t	0.00	draft	\N	\N	\N	{college,sat,education,high-school,free}	\N	2026-05-09 23:56:00.85	2026-05-10 19:51:08.996	\N
2b91e9e6-47c8-4c86-aa24-7ed248cfa174	ecf9e6ba-edc3-4194-8e8f-1166e432d4db	1c8066a4-0fc4-4a6a-906d-8a662618a774	Neighborhood Block Party	neighborhood-block-party-sv-2026	Annual neighborhood block party with live music, bounce houses, face painting, BBQ, and community booths. Meet your neighbors and celebrate our community!	Annual block party with food, music, and fun.	2026-06-18 23:56:00.819	2026-06-19 05:56:00.819	America/Los_Angeles	Murphy Park	250 N Sunnyvale Ave	Sunnyvale	CA	94085	US	37.3811000	-122.0274000	f	\N	https://images.unsplash.com/photo-1529543544282-ea75407407db	500	t	0.00	approved	\N	\N	\N	{community,block-party,family-friendly,outdoor}	\N	2026-05-09 23:56:00.846	2026-05-10 19:51:09	\N
528adf3c-d30c-4586-93ce-acc8f5ce1d77	ecf9e6ba-edc3-4194-8e8f-1166e432d4db	1c8066a4-0fc4-4a6a-906d-8a662618a774	Cultural Heritage Festival	cultural-heritage-festival-2026	Celebrate the diverse cultural heritage of the Bay Area with traditional performances, ethnic food, craft vendors, and storytelling from 20+ cultural communities.	Multicultural festival celebrating Bay Area diversity.	2026-03-25 23:56:00.819	2026-03-26 07:56:00.819	America/Los_Angeles	San Jose Convention Center	150 W San Carlos St	San Jose	CA	95113	US	37.3296000	-121.8880000	f	\N	https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3	3000	t	0.00	completed	\N	\N	\N	{culture,festival,diversity,heritage}	\N	2026-05-09 23:56:00.847	2026-05-10 19:51:09	\N
62239752-1d67-4042-82c5-e6a65f347f6b	ecf9e6ba-edc3-4194-8e8f-1166e432d4db	97803d88-5bf0-41d1-a6ba-06b3a65f5fd5	E2E Reject 1778374338	e2e-reject-1778374338-ea1871	End-to-end verification with sufficient description text here.	E2E	2026-08-01 18:00:00	2026-08-01 22:00:00	America/Los_Angeles	San Jose Convention Center	150 W San Carlos St	San Jose	CA	95113	US	37.3296000	-121.8880000	f	\N	\N	100	t	0.00	cancelled	no	ccfb3f1d-0ffe-4eaa-971e-66adc11df4d5	2026-05-10 00:52:19.06	{e2e}	[]	2026-05-10 00:52:18.982	2026-05-10 19:51:09.001	\N
0a9609d2-24d7-4557-ba7f-d48ad99a046b	ecf9e6ba-edc3-4194-8e8f-1166e432d4db	97803d88-5bf0-41d1-a6ba-06b3a65f5fd5	E2E Verify 1778374338	e2e-verify-1778374338-ed7bc8	End-to-end verification with sufficient description text here.	E2E	2026-08-01 18:00:00	2026-08-01 22:00:00	America/Los_Angeles	San Jose Convention Center	150 W San Carlos St	San Jose	CA	95113	US	37.3296000	-121.8880000	f	\N	\N	100	t	0.00	cancelled	ok	ccfb3f1d-0ffe-4eaa-971e-66adc11df4d5	2026-05-10 00:52:18.968	{e2e}	[]	2026-05-10 00:52:18.813	2026-05-10 19:51:09.001	\N
2ac5f472-f85d-4b0a-928e-c2b94d814036	ecf9e6ba-edc3-4194-8e8f-1166e432d4db	a413cb3d-4a15-495a-b0c3-8147a49d0fd0	Silicon Valley AI & ML Summit 2026	sv-ai-ml-summit-2026	The premier AI and machine learning conference in Silicon Valley. Two days of keynotes, workshops, and networking with industry leaders from Google, Meta, Apple, and top startups.	Premier AI/ML conference with industry leaders.	2026-06-23 23:56:00.819	2026-06-25 07:56:00.819	America/Los_Angeles	San Jose Convention Center	150 W San Carlos St	San Jose	CA	95113	US	37.3296000	-121.8880000	f	\N	https://images.unsplash.com/photo-1485827404703-89b55fcc595e	3000	f	299.00	approved	\N	\N	\N	{ai,machine-learning,tech,conference}	[{"time": "9:00 AM", "title": "Registration & Breakfast", "speaker": ""}, {"time": "10:00 AM", "title": "Keynote: The Future of AGI", "speaker": "Dr. Sarah Chen"}, {"time": "11:30 AM", "title": "Panel: AI Ethics in Practice", "speaker": "Various"}, {"time": "1:00 PM", "title": "Lunch Break", "speaker": ""}, {"time": "2:00 PM", "title": "Workshop: Building with LLMs", "speaker": "James Liu"}, {"time": "4:00 PM", "title": "Networking Reception", "speaker": ""}]	2026-05-09 23:56:00.829	2026-05-10 19:51:09.002	\N
cba1147a-0ac1-4ded-b1af-b89e52a28b3a	ecf9e6ba-edc3-4194-8e8f-1166e432d4db	97803d88-5bf0-41d1-a6ba-06b3a65f5fd5	hgfvhsdgjvnjf	hgfvhsdgjvnjf-f5a6f0	sdjfjfrkjgjsdjfjfrkjgjsdjfjfrkjgjsdjfjfrkjgjsdjfjfrkjgjsdjfjfrkjgjsdjfjfrkjgjsdjfjfrkjgjsdjfjfrkjgjsdjfjfrkjgjsdjfjfrkjgjsdjfjfrkjgjsdjfjfrkjgjsdjfjfrkjgjsdjfjfrkjgjsdjfjfrkjgjsdjfjfrkjgj	sfjrejkhrjg	2026-05-11 00:38:00	2026-05-21 00:38:00	UTC	San Jose Convention Center	150 W San Carlos St	San Jose	CA	95113	United States	37.3296000	-121.8880000	f	\N	\N	100	t	0.00	cancelled	\N	ccfb3f1d-0ffe-4eaa-971e-66adc11df4d5	2026-05-10 01:07:10.093	{dnfjrdngjnjkgntjgnj}	[]	2026-05-10 00:39:14.212	2026-05-11 08:00:45.548	\N
c5b66002-ba70-40e3-ab28-92aabe705226	326cab9a-52d9-47d9-b8ca-ddc0657ad122	bc0ab55f-47da-4bb3-981b-7ea2932ed96a	Craft Beer & Artisan Cheese Pairing	craft-beer-cheese-pairing-2026	Explore the perfect pairings of local craft beers and artisan cheeses from Bay Area producers. Guided by a certified cicerone and cheese expert.	Craft beer and artisan cheese pairing event.	2026-06-11 23:56:00.819	2026-06-12 02:56:00.819	America/Los_Angeles	Fort Mason Center	2 Marina Blvd	San Francisco	CA	94123	US	37.8064000	-122.4315000	f	\N	https://images.unsplash.com/photo-1535958636474-b021ee887b13	30	f	70.00	approved	\N	ccfb3f1d-0ffe-4eaa-971e-66adc11df4d5	2026-05-10 23:38:17.726	{beer,cheese,pairing,craft,artisan}	\N	2026-05-09 23:56:00.856	2026-05-10 23:38:17.726	\N
4acd7593-709f-4cf9-8482-0e5fa05fa455	ecf9e6ba-edc3-4194-8e8f-1166e432d4db	97803d88-5bf0-41d1-a6ba-06b3a65f5fd5	E2E Moderation Check 1778375094	e2e-moderation-check-1778375094-daba69	A long enough description for validation rules.	\N	2026-07-16 01:00:00	2026-07-16 04:00:00	UTC	Moscone Center	747 Howard St	San Francisco	CA	94103	US	37.7842000	-122.4016000	f	\N	\N	1	t	0.00	cancelled	\N	ccfb3f1d-0ffe-4eaa-971e-66adc11df4d5	2026-05-10 01:05:13.77	{}	[]	2026-05-10 01:04:54.179	2026-05-11 08:00:36.985	\N
c1b003ab-e528-4232-a792-3c9de624bb39	326cab9a-52d9-47d9-b8ca-ddc0657ad122	bc0ab55f-47da-4bb3-981b-7ea2932ed96a	San Jose Food Truck Festival	sj-food-truck-festival-2026	Over 40 food trucks gather at San Pedro Square for a weekend celebration of street food. Live music, craft beer garden, and a dessert alley you won't want to miss.	40+ food trucks, live music, and craft beer.	2026-06-03 23:56:00.819	2026-06-05 05:56:00.819	America/Los_Angeles	San Pedro Square Market	87 N San Pedro St	San Jose	CA	95110	US	37.3365000	-121.8944000	f	\N	https://images.unsplash.com/photo-1565123409695-7b5ef63a2efb	5000	t	0.00	approved	\N	\N	\N	{food,food-truck,festival,street-food}	\N	2026-05-09 23:56:00.835	2026-05-10 19:51:08.999	\N
f046ebb6-2c2f-41dd-adf1-2f3e053867ae	ecf9e6ba-edc3-4194-8e8f-1166e432d4db	27bea48e-671b-4a53-8dbd-5e5302a03c16	Bay Area Jazz Night	bay-area-jazz-night-2026	An evening of smooth jazz performances featuring local Bay Area artists. Enjoy world-class musicians in an intimate setting with craft cocktails and gourmet appetizers.	Live jazz performances by local Bay Area artists.	2026-05-23 23:56:00.819	2026-05-24 03:56:00.819	America/Los_Angeles	The Fillmore	1805 Geary Blvd	San Francisco	CA	94115	US	37.7840000	-122.4331000	f	\N	https://images.unsplash.com/photo-1511192336575-5a79af67a629	500	f	35.00	approved	\N	\N	\N	{jazz,live-music,nightlife}	\N	2026-05-09 23:56:00.82	2026-05-10 19:51:09.002	\N
a204b317-0fc6-4308-a8fd-81737b8b0678	ecf9e6ba-edc3-4194-8e8f-1166e432d4db	b338f833-7ff4-4dc2-9af4-0b1c706bd99f	fjdrgkgldjklgjkdfjkgldfklgkl	fjdrgkgldjklgjkdfjkgldfklgkl-cb8f3d	fkjdgkjfklgjkljtglkjgtkljtgklfkjdgkjfklgjkljtglkjgtkljtgklfkjdgkjfklgjkljtglkjgtkljtgklfkjdgkjfklgjkljtglkjgtkljtgklfkjdgkjfklgjkljtglkjgtkljtgklfkjdgkjfklgjkljtglkjgtkljtgklfkjdgkjfklgjkljtglkjgtkljtgklfkjdgkjfklgjkljtglkjgtkljtgklfkjdgkjfklgjkljtglkjgtkljtgkl	fkjdgkjfklgjkljtglkjgtkljtgkl	2026-05-23 00:58:00	2026-06-01 00:59:00	America/New_York	San Jose Convention Center	150 W San Carlos St	San Jose	CA	95113	United States	37.3296000	-121.8880000	f	\N	\N	200	t	0.00	cancelled	\N	ccfb3f1d-0ffe-4eaa-971e-66adc11df4d5	2026-05-10 01:07:04.811	{gnkrmklgmkrt}	[]	2026-05-10 01:00:05.046	2026-05-11 08:00:41.747	\N
fb7a42d2-823b-4b98-a18d-1a9955d867e0	ecf9e6ba-edc3-4194-8e8f-1166e432d4db	97803d88-5bf0-41d1-a6ba-06b3a65f5fd5	test1 	test1-5e4576	abcbkkskhdkhdkhdldjabcbkkskhdkhdkhdldjabcbkkskhdkhdkhdldjabcbkkskhdkhdkhdldjabcbkkskhdkhdkhdldjabcbkkskhdkhdkhdldjabcbkkskhdkhdkhdldjabcbkkskhdkhdkhdldjabcbkkskhdkhdkhdldjabcbkkskhdkhdkhdldjabcbkkskhdkhdkhdldjabcbkkskhdkhdkhdldjabcbkkskhdkhdkhdldjabcbkkskhdkhdkhdldjabcbkkskhdkhdkhdldjabcbkkskhdkhdkhdldjabcbkkskhdkhdkhdldj	\N	2026-05-20 07:51:00	2026-05-22 07:51:00	America/New_York	ab	1334 The Alameda	San Jose	CA	95126	United States	\N	\N	f	\N	\N	1	f	5.00	rejected	to bad	ccfb3f1d-0ffe-4eaa-971e-66adc11df4d5	2026-05-11 00:55:41.615	{}	[]	2026-05-11 00:54:17.011	2026-05-11 00:57:53.127	\N
0f1cecb4-31a4-4798-bfde-d510201c0c2b	ecf9e6ba-edc3-4194-8e8f-1166e432d4db	b338f833-7ff4-4dc2-9af4-0b1c706bd99f	test2	test2-1b4a83	abbbnlalnlnlnllnknabbbnlalnlnlnllnknabbbnlalnlnlnllnknabbbnlalnlnlnllnknabbbnlalnlnlnllnknabbbnlalnlnlnllnknabbbnlalnlnlnllnknabbbnlalnlnlnllnknabbbnlalnlnlnllnknabbbnlalnlnlnllnknabbbnlalnlnlnllnknabbbnlalnlnlnllnknabbbnlalnlnlnllnknabbbnlalnlnlnllnknabbbnlalnlnlnllnknabbbnlalnlnlnllnknabbbnlalnlnlnllnknabbbnlalnlnlnllnknabbbnlalnlnlnllnknabbbnlalnlnlnllnkn	\N	2026-05-21 21:59:00	2026-05-22 21:59:00	America/New_York	abc	1334 The Alameda	San Jose	CA	95126	United States	\N	\N	f	\N	\N	3	t	0.00	cancelled	good job	ccfb3f1d-0ffe-4eaa-971e-66adc11df4d5	2026-05-11 01:00:10.995	{}	[]	2026-05-11 00:59:39.609	2026-05-11 01:50:02.259	\N
010eb25f-165f-4329-bdb6-961385bfb7fc	ecf9e6ba-edc3-4194-8e8f-1166e432d4db	1c8066a4-0fc4-4a6a-906d-8a662618a774	test3	test3-181ce9	kakhkhkahkhkhkahkhkahkhhkkakhkhkahkhkhkahkhkahkhhkkakhkhkahkhkhkahkhkahkhhkkakhkhkahkhkhkahkhkahkhhkkakhkhkahkhkhkahkhkahkhhkkakhkhkahkhkhkahkhkahkhhkkakhkhkahkhkhkahkhkahkhhkkakhkhkahkhkhkahkhkahkhhkkakhkhkahkhkhkahkhkahkhhkkakhkhkahkhkhkahkhkahkhhkkakhkhkahkhkhkahkhkahkhhkkakhkhkahkhkhkahkhkahkhhkkakhkhkahkhkhkahkhkahkhhk	\N	2026-05-30 08:52:00	2026-05-31 08:52:00	America/Anchorage	jahja	bakba	ahkah	ajgjg	ajbja	abajab	\N	\N	f	\N	\N	3	t	0.00	approved	\N	ccfb3f1d-0ffe-4eaa-971e-66adc11df4d5	2026-05-11 06:12:28.135	{}	[]	2026-05-11 01:53:11.768	2026-05-11 06:12:28.136	\N
b06b5afd-0b8a-4c74-8145-54f9939c68c9	ecf9e6ba-edc3-4194-8e8f-1166e432d4db	97803d88-5bf0-41d1-a6ba-06b3a65f5fd5	test1	test1-1d691a	bhjnjfdjnfnfnbhjnjfdjnfnfnbhjnjfdjnfnfnbhjnjfdjnfnfnbhjnjfdjnfnfnbhjnjfdjnfnfnbhjnjfdjnfnfnbhjnjfdjnfnfnbhjnjfdjnfnfnbhjnjfdjnfnfnbhjnjfdjnfnfnbhjnjfdjnfnfnbhjnjfdjnfnfnbhjnjfdjnfnfn	hdfjnfj	2026-05-19 07:09:00	2026-05-29 07:09:00	America/New_York	hewjnjrf	fjvnvfjvnjf	fvjngjvn	bvj gjn	vjfnjgnvj	fvjngjn	\N	\N	f	\N	\N	1	t	0.00	cancelled	Great event	ccfb3f1d-0ffe-4eaa-971e-66adc11df4d5	2026-05-11 07:11:59.922	{hello}	[]	2026-05-11 07:10:20.862	2026-05-11 07:56:31.214	\N
d11c43ee-68e6-4cfe-b298-8635c268e75e	ecf9e6ba-edc3-4194-8e8f-1166e432d4db	43df6b28-82e2-44ab-9db1-98e5e9d66081	test5	test5-d9a7ea	hellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohello	hellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohello	2026-05-21 07:57:00	2026-05-29 07:57:00	America/New_York	mfmvm	m,	gvfcd	fd	54321	gfds	\N	\N	f	\N	\N	10	t	0.00	rejected	bad event!	ccfb3f1d-0ffe-4eaa-971e-66adc11df4d5	2026-05-11 07:59:11.132	{hello}	[]	2026-05-11 07:58:22.925	2026-05-11 07:59:11.133	\N
e475d922-ebae-4134-b8bb-c64236d83858	ecf9e6ba-edc3-4194-8e8f-1166e432d4db	bc0ab55f-47da-4bb3-981b-7ea2932ed96a	test-60	test-60-98dded	hello-hello-hello-hello-hello-hello-hello-hello-hello-hello-hello-hello-hello-hello-hello-hello-hello-hello-hello-hello-hello-hello-hello-hello-hello-hello-hello-hello-hello-hello-hello-hello-hello-hello-hello-hello-hello-hello-hello-hello-hello-hello-hello-hello-hello-hello-hello-hello-hello-hello-hello-hello-hello-hello-hello-hello-hello-hello-hello-hello-hello-hello-hello-hello-hello-hello-hello-hello-hello-hello-hello-hello-hello-hello-hello-hello-hello-hello-hello-hello-hello-hello-hello-hello-hello-hello-hello-hello-hello-hello-hello-hello-hello-hello-hello-hello-hello-hello-hello-hello-hello-hello-hello-hello-hello-hello-hello-hello-hello-hello-hello-hello-hello-hello-hello-hello-hello-hello-hello-hello-hello-hello-hello-hello-hello-hello-hello-hello-hello-hello-hello-hello-hello-hello-hello-hello-hello-hello-hello-hello-hello-hello-hello-hello-hello-hello-hello-hello-hello-hello-hello-hello-hello-hello-hello-hello-hello-hello-hello-hello-hello-hello-	hello-hello-hello-hello-hello-hello-hello-hello	2026-05-13 08:05:00	2026-05-16 08:05:00	America/New_York	hello-hello-hello-hello-	hello-hello-hello-hello-hello-hello-	hello-hello-hello-hello-hello-hello-	hello-hello-hello-hello-	hello-hello-hello-hello-hello-hello-	hello-hello-hello-hello-hello-hello-	\N	\N	f	\N	\N	50	t	0.00	pending_approval	\N	\N	\N	{food}	[]	2026-05-11 08:05:38.65	2026-05-11 08:05:38.65	\N
8b833ef0-2bbb-49fe-ab44-eea2755f6b53	ecf9e6ba-edc3-4194-8e8f-1166e432d4db	97803d88-5bf0-41d1-a6ba-06b3a65f5fd5	bye-good-bye-good-bye-good	bye-good-bye-good-bye-good-fbe153	bye-good-bye-good-bye-goodbye-good-bye-good-bye-goodbye-good-bye-good-bye-goodbye-good-bye-good-bye-goodbye-good-bye-good-bye-goodbye-good-bye-good-bye-goodbye-good-bye-good-bye-goodbye-good-bye-good-bye-good	bye-good-bye-good-bye-good	2026-05-20 08:20:00	2026-05-29 08:20:00	America/Denver	dfsdaf	fdadvcf f	dvdfvfdfd	CA	34499	CA	\N	\N	f	\N	\N	50	t	0.00	pending_approval	\N	\N	\N	{}	[]	2026-05-11 08:22:20.303	2026-05-11 08:22:20.303	\N
\.


--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.notifications (id, user_id, event_id, type, title, message, is_read, channel, sent_at) FROM stdin;
6f8d1ad1-2836-4e97-a991-a42e4d566ced	dfbf5dd5-7284-4ec6-a5af-14f3043750f3	5afdcfa9-56f6-45f2-8353-d210835a8072	ticket_confirmation	Ticket Purchased	You have successfully purchased 1 ticket(s) for the event.	f	in_app	2026-05-10 00:52:24.133
8452d984-8251-4fff-9814-d615e4371c6f	4c7e57a7-9c3e-4b82-bf27-f81b0deaa729	d9bcead1-664a-4442-b319-64ee76d2de5f	ticket_confirmation	Ticket Purchased	You have successfully purchased 1 ticket(s) for the event.	f	in_app	2026-05-10 18:52:10.167
502549e5-3c29-45e4-9f49-1abf2e548714	4c7e57a7-9c3e-4b82-bf27-f81b0deaa729	d9bcead1-664a-4442-b319-64ee76d2de5f	ticket_confirmation	Ticket Purchased	You have successfully purchased 1 ticket(s) for the event.	f	in_app	2026-05-10 18:52:10.181
24d91a9a-4681-4107-90b3-9b860263b824	462f1084-506b-41bc-8f52-48cd139111da	2b91e9e6-47c8-4c86-aa24-7ed248cfa174	rsvp_approved	RSVP approved	Your request to attend "Neighborhood Block Party" was approved. You're confirmed!	f	in_app	2026-05-10 19:55:05.309
776a6330-c722-4780-bdd1-8ec740342d8f	f78570fc-d61a-4004-8305-47582fd8161d	a204b317-0fc6-4308-a8fd-81737b8b0678	rsvp_approved	RSVP approved	Your request to attend "fjdrgkgldjklgjkdfjkgldfklgkl" was approved. You're confirmed!	f	in_app	2026-05-10 19:55:06.065
4f9c8345-bfd6-41df-a201-b28b9d76844b	8ad4720c-9a42-400d-8c59-f297878d08c9	fb8fa0f6-b1a4-40e5-a3e4-443c32c3273e	rsvp_approved	RSVP approved	Your request to attend "React & Next.js Developer Meetup" was approved. You're confirmed!	f	in_app	2026-05-10 19:55:07.081
3d28459e-216c-45c3-8702-4e30756853df	8ad4720c-9a42-400d-8c59-f297878d08c9	2d41214e-687e-4af0-972d-5b1752745562	rsvp_approved	RSVP approved	Your request to attend "Remote Work Best Practices Webinar" was approved. You're confirmed!	f	in_app	2026-05-10 19:55:07.647
0aa01233-3653-4b35-9d94-aab7e3236739	dfbf5dd5-7284-4ec6-a5af-14f3043750f3	2b91e9e6-47c8-4c86-aa24-7ed248cfa174	rsvp_approved	RSVP approved	Your request to attend "Neighborhood Block Party" was approved. You're confirmed!	f	in_app	2026-05-10 19:55:08.481
4f59687f-7b51-4628-9cc4-1342afd8ad4d	dfbf5dd5-7284-4ec6-a5af-14f3043750f3	fb8fa0f6-b1a4-40e5-a3e4-443c32c3273e	rsvp_approved	RSVP approved	Your request to attend "React & Next.js Developer Meetup" was approved. You're confirmed!	f	in_app	2026-05-10 19:55:08.848
ec5620f3-2c7d-426d-85d6-3e3891b8424a	dfbf5dd5-7284-4ec6-a5af-14f3043750f3	cba1147a-0ac1-4ded-b1af-b89e52a28b3a	rsvp_approved	RSVP approved	Your request to attend "hgfvhsdgjvnjf" was approved. You're confirmed!	f	in_app	2026-05-10 19:55:09.232
3232f75b-5205-48e1-8ab7-a18a3e235341	dfbf5dd5-7284-4ec6-a5af-14f3043750f3	2d41214e-687e-4af0-972d-5b1752745562	rsvp_approved	RSVP approved	Your request to attend "Remote Work Best Practices Webinar" was approved. You're confirmed!	f	in_app	2026-05-10 19:55:09.648
e2441e98-09ec-495e-b1c7-71f48bbf0c31	dfbf5dd5-7284-4ec6-a5af-14f3043750f3	2cf78b12-a368-4b7a-8d21-e426bded960f	ticket_confirmation	Ticket Purchased	You have successfully purchased 1 ticket(s) for the event.	f	in_app	2026-05-10 23:45:40.817
d93d468b-4028-4afe-8065-31b9025b9123	dfbf5dd5-7284-4ec6-a5af-14f3043750f3	cba1147a-0ac1-4ded-b1af-b89e52a28b3a	rsvp_approved	RSVP approved	Your request to attend "hgfvhsdgjvnjf" was approved. You're confirmed!	f	in_app	2026-05-10 23:46:45.544
ee18044c-97cb-4bc9-9dbf-ee6ee298b81b	dfbf5dd5-7284-4ec6-a5af-14f3043750f3	fb8fa0f6-b1a4-40e5-a3e4-443c32c3273e	rsvp_approved	RSVP approved	Your request to attend "React & Next.js Developer Meetup" was approved. You're confirmed!	f	in_app	2026-05-11 00:39:18.602
7f7732bf-c9ba-437c-b6f5-ae2071011d96	dfbf5dd5-7284-4ec6-a5af-14f3043750f3	4acd7593-709f-4cf9-8482-0e5fa05fa455	rsvp_approved	RSVP approved	Your request to attend "E2E Moderation Check 1778375094" was approved. You're confirmed!	f	in_app	2026-05-11 00:44:22.043
6a3bd805-2a77-45e6-be87-6a5861b75d43	dfbf5dd5-7284-4ec6-a5af-14f3043750f3	0f1cecb4-31a4-4798-bfde-d510201c0c2b	rsvp_approved	RSVP approved	Your request to attend "test2" was approved. You're confirmed!	f	in_app	2026-05-11 01:22:53.309
c0c06c88-080f-44d0-8ef6-042fbd63e07c	ecf9e6ba-edc3-4194-8e8f-1166e432d4db	b06b5afd-0b8a-4c74-8145-54f9939c68c9	event_approved	Event approved	"test1" was approved and is now live. Admin notes: Great event	f	in_app	2026-05-11 07:11:59.925
8bbb2c46-3c45-4add-bf3d-b1675aeab3da	ecf9e6ba-edc3-4194-8e8f-1166e432d4db	b06b5afd-0b8a-4c74-8145-54f9939c68c9	rsvp_request	New RSVP request	A new RSVP request was received for "test1".	f	in_app	2026-05-11 07:12:26.976
f0c3092e-4fb3-40d9-b4cb-10255232ec53	dfbf5dd5-7284-4ec6-a5af-14f3043750f3	b06b5afd-0b8a-4c74-8145-54f9939c68c9	rsvp_approved	RSVP approved	Your request to attend "test1" was approved. You're confirmed!	f	in_app	2026-05-11 07:12:47.161
4fd7ec4a-5a82-47c2-9721-f2498b95830f	3b33cdbe-b9c0-48f5-ae10-70690765c792	2d41214e-687e-4af0-972d-5b1752745562	rsvp_approved	RSVP approved	Your request to attend "Remote Work Best Practices Webinar" was approved. You're confirmed!	t	in_app	2026-05-10 19:55:06.535
45677176-a0ce-45e5-821d-188d526e5c4f	3b33cdbe-b9c0-48f5-ae10-70690765c792	2b91e9e6-47c8-4c86-aa24-7ed248cfa174	rsvp_approved	RSVP approved	Your request to attend "Neighborhood Block Party" was approved. You're confirmed!	t	in_app	2026-05-10 19:55:08.066
28612c46-fc4c-40be-a101-7f7c1a4fb963	3b33cdbe-b9c0-48f5-ae10-70690765c792	4acd7593-709f-4cf9-8482-0e5fa05fa455	rsvp_approved	RSVP approved	Your request to attend "E2E Moderation Check 1778375094" was approved. You're confirmed!	t	in_app	2026-05-11 00:44:23.039
fcc0c609-2375-4a8b-ab9f-fb744912bab0	3b33cdbe-b9c0-48f5-ae10-70690765c792	0f1cecb4-31a4-4798-bfde-d510201c0c2b	rsvp_approved	RSVP approved	Your request to attend "test2" was approved. You're confirmed!	t	in_app	2026-05-11 01:26:03.148
511a084f-a17a-4448-85de-fdbf333b3495	dfbf5dd5-7284-4ec6-a5af-14f3043750f3	b06b5afd-0b8a-4c74-8145-54f9939c68c9	event_cancelled	Event cancelled	"test1" was cancelled.	f	in_app	2026-05-11 07:56:31.224
0435fc67-2e3f-4064-bebc-bf471d2027c0	ccfb3f1d-0ffe-4eaa-971e-66adc11df4d5	b06b5afd-0b8a-4c74-8145-54f9939c68c9	event_pending_approval	New event pending approval	"test1" is awaiting review.	t	in_app	2026-05-11 07:10:20.866
fd360e69-37ce-478f-8ad4-e77550e8c751	ccfb3f1d-0ffe-4eaa-971e-66adc11df4d5	d11c43ee-68e6-4cfe-b298-8635c268e75e	event_pending_approval	New event pending approval	"test5" is awaiting review.	f	in_app	2026-05-11 07:58:22.929
d51f665e-ed36-485c-b4a6-4a320697a107	ecf9e6ba-edc3-4194-8e8f-1166e432d4db	d11c43ee-68e6-4cfe-b298-8635c268e75e	event_rejected	Event rejected	"test5" was rejected. Admin notes: bad event!	t	in_app	2026-05-11 07:59:11.138
6e37d7bf-d92e-45da-9ebb-459683aa75b4	3b33cdbe-b9c0-48f5-ae10-70690765c792	4acd7593-709f-4cf9-8482-0e5fa05fa455	event_cancelled	Event cancelled	"E2E Moderation Check 1778375094" was cancelled.	f	in_app	2026-05-11 08:00:36.99
0b1bf46a-9fc1-47ba-95ad-fa6733b7130a	f78570fc-d61a-4004-8305-47582fd8161d	a204b317-0fc6-4308-a8fd-81737b8b0678	event_cancelled	Event cancelled	"fjdrgkgldjklgjkdfjkgldfklgkl" was cancelled.	f	in_app	2026-05-11 08:00:41.749
cb7120ac-2603-4815-b0a8-feb242821599	dfbf5dd5-7284-4ec6-a5af-14f3043750f3	cba1147a-0ac1-4ded-b1af-b89e52a28b3a	event_cancelled	Event cancelled	"hgfvhsdgjvnjf" was cancelled.	f	in_app	2026-05-11 08:00:45.55
7f54f2ac-9610-44cf-863f-697ba57ad488	dfbf5dd5-7284-4ec6-a5af-14f3043750f3	4acd7593-709f-4cf9-8482-0e5fa05fa455	event_cancelled	Event cancelled	"E2E Moderation Check 1778375094" was cancelled.	t	in_app	2026-05-11 08:00:36.99
c6934a0c-74fc-4237-b680-fa69a92a9878	ccfb3f1d-0ffe-4eaa-971e-66adc11df4d5	e475d922-ebae-4134-b8bb-c64236d83858	event_pending_approval	New event pending approval	"test-60" is awaiting review.	f	in_app	2026-05-11 08:05:38.657
52dda328-bc63-4dbf-abac-8dfc1b21bf23	ccfb3f1d-0ffe-4eaa-971e-66adc11df4d5	8b833ef0-2bbb-49fe-ab44-eea2755f6b53	event_pending_approval	New event pending approval	"bye-good-bye-good-bye-good" is awaiting review.	f	in_app	2026-05-11 08:22:20.311
\.


--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.refresh_tokens (id, user_id, token, expires_at, created_at) FROM stdin;
c358c498-2cff-42b4-b8b3-029bcd9f2854	ecf9e6ba-edc3-4194-8e8f-1166e432d4db	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJlY2Y5ZTZiYS1lZGMzLTQxOTQtOGU4Zi0xMTY2ZTQzMmQ0ZGIiLCJlbWFpbCI6Im9yZzFAZXZlbnRodWIuY29tIiwicm9sZSI6Im9yZ2FuaXplciIsImlhdCI6MTc3ODQ4NjY1NSwiZXhwIjoxNzc5MDkxNDU1fQ.PePTKrbSUBDWjLRahko8Jzbs5exbtlnDnE3iVzhyb_8	2026-05-18 08:04:15.452	2026-05-11 08:04:15.452
2896ca72-0d9f-4dfc-8170-9a5ab6b57b8d	ecf9e6ba-edc3-4194-8e8f-1166e432d4db	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJlY2Y5ZTZiYS1lZGMzLTQxOTQtOGU4Zi0xMTY2ZTQzMmQ0ZGIiLCJlbWFpbCI6Im9yZzFAZXZlbnRodWIuY29tIiwicm9sZSI6Im9yZ2FuaXplciIsImlhdCI6MTc3ODQ4NzU3NSwiZXhwIjoxNzc5MDkyMzc1fQ.LEEdVtsKy3VCIcQ29WKiychygjkEgNq6fhKegdrI9Y4	2026-05-18 08:19:35.444	2026-05-11 08:19:35.444
23460706-e613-427f-ae42-978e807e5eae	8ad4720c-9a42-400d-8c59-f297878d08c9	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI4YWQ0NzIwYy05YTQyLTQwMGQtOGM1OS1mMjk3ODc4ZDA4YzkiLCJlbWFpbCI6InVzZXIzQGV2ZW50aHViLmNvbSIsInJvbGUiOiJhdHRlbmRlZSIsImlhdCI6MTc3ODQ2Mjc3NiwiZXhwIjoxNzc5MDY3NTc2fQ.d8YwLlhK-Wmv1xBdl9YrtN7LvyrXyBWyCkRWxnzOzd0	2026-05-18 01:26:16.506	2026-05-11 01:26:16.506
3e85595d-416f-46ef-b3ed-6fcbc2c4fb0e	3b33cdbe-b9c0-48f5-ae10-70690765c792	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzYjMzY2RiZS1iOWMwLTQ4ZjUtYWUxMC03MDY5MDc2NWM3OTIiLCJlbWFpbCI6InVzZXIyQGV2ZW50aHViLmNvbSIsInJvbGUiOiJhdHRlbmRlZSIsImlhdCI6MTc3ODQ4MzU4NSwiZXhwIjoxNzc5MDg4Mzg1fQ.jVLBcPvkVvcoi_5GDmYx40dNUPK03fbDk2h-tCC0N9w	2026-05-18 07:13:05.379	2026-05-11 07:13:05.38
\.


--
-- Data for Name: rsvps; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.rsvps (id, event_id, user_id, status, created_at, updated_at, approval_status) FROM stdin;
aa29e793-abcc-47c1-9905-8e0c72ab8178	5afdcfa9-56f6-45f2-8353-d210835a8072	4c7e57a7-9c3e-4b82-bf27-f81b0deaa729	going	2026-05-10 18:53:03.787	2026-05-10 18:53:03.787	not_required
b9dd347d-86ec-43cc-87f1-27ed0e254236	59434da7-65f3-4772-befe-5397ca143b26	4c7e57a7-9c3e-4b82-bf27-f81b0deaa729	maybe	2026-05-10 18:53:35.621	2026-05-10 18:53:35.621	not_required
eb80490a-e0af-4273-9d39-6dc4cad23023	0691332a-c040-47e5-81d4-038fec940b13	4c7e57a7-9c3e-4b82-bf27-f81b0deaa729	going	2026-05-10 18:59:59.542	2026-05-10 18:59:59.542	pending
4cbde282-09fa-4ee2-8f82-b05bd5b21208	5afdcfa9-56f6-45f2-8353-d210835a8072	dfbf5dd5-7284-4ec6-a5af-14f3043750f3	going	2026-05-10 00:52:19.111	2026-05-10 19:37:24.609	pending
2086020e-7d6a-413c-9c95-50712553ac3b	0691332a-c040-47e5-81d4-038fec940b13	dfbf5dd5-7284-4ec6-a5af-14f3043750f3	going	2026-05-10 19:37:29.548	2026-05-10 19:37:29.548	pending
098abd40-6edd-4412-a65d-ef3202daae7a	2b91e9e6-47c8-4c86-aa24-7ed248cfa174	462f1084-506b-41bc-8f52-48cd139111da	going	2026-05-10 19:51:09.094	2026-05-10 19:55:05.305	approved
318dd3d9-bf2b-4036-9434-c9183229f0b7	a204b317-0fc6-4308-a8fd-81737b8b0678	f78570fc-d61a-4004-8305-47582fd8161d	going	2026-05-10 19:51:09.094	2026-05-10 19:55:06.064	approved
668d5e12-2b0f-4d0f-90a5-a9268f700385	2d41214e-687e-4af0-972d-5b1752745562	3b33cdbe-b9c0-48f5-ae10-70690765c792	going	2026-05-10 19:51:09.093	2026-05-10 19:55:06.534	approved
d3f7e0aa-16b1-4b7e-a06b-a152a9bdab4e	fb8fa0f6-b1a4-40e5-a3e4-443c32c3273e	8ad4720c-9a42-400d-8c59-f297878d08c9	going	2026-05-10 19:51:09.093	2026-05-10 19:55:07.08	approved
5f397679-7cc1-4132-8a7d-3f83218b06da	2d41214e-687e-4af0-972d-5b1752745562	8ad4720c-9a42-400d-8c59-f297878d08c9	going	2026-05-10 19:50:30.66	2026-05-10 19:55:07.646	approved
07f579fd-de87-4f3b-bfeb-31b838e44b57	2b91e9e6-47c8-4c86-aa24-7ed248cfa174	3b33cdbe-b9c0-48f5-ae10-70690765c792	going	2026-05-10 19:50:30.659	2026-05-10 19:55:08.065	approved
f6b3752d-1af1-4e2b-aba2-a6176f682298	2b91e9e6-47c8-4c86-aa24-7ed248cfa174	dfbf5dd5-7284-4ec6-a5af-14f3043750f3	going	2026-05-10 19:38:24.91	2026-05-10 19:55:08.48	approved
be37b0ac-6cb8-4897-ae70-061d763567f9	2d41214e-687e-4af0-972d-5b1752745562	dfbf5dd5-7284-4ec6-a5af-14f3043750f3	going	2026-05-10 19:37:51.864	2026-05-10 19:55:09.647	approved
7c0bdd5c-2428-4234-bcd7-e54d1522f3c6	cba1147a-0ac1-4ded-b1af-b89e52a28b3a	dfbf5dd5-7284-4ec6-a5af-14f3043750f3	going	2026-05-10 19:37:59.311	2026-05-10 23:46:45.543	approved
56604259-4dfa-4f74-919a-9b8a58848f6b	52c1f25a-715e-40c0-a209-8e1e31271870	dfbf5dd5-7284-4ec6-a5af-14f3043750f3	not_going	2026-05-11 00:34:45.128	2026-05-11 00:35:16.411	not_required
503b23fc-5ecf-47b4-8bf0-914ed98d339a	fb8fa0f6-b1a4-40e5-a3e4-443c32c3273e	dfbf5dd5-7284-4ec6-a5af-14f3043750f3	not_going	2026-05-10 19:38:10.978	2026-05-11 00:39:47.755	not_required
a11dbdee-c034-4912-be0b-d9e61fead5e8	4acd7593-709f-4cf9-8482-0e5fa05fa455	dfbf5dd5-7284-4ec6-a5af-14f3043750f3	going	2026-05-11 00:43:20.01	2026-05-11 00:44:22.042	approved
5fd39f9e-f3f1-4ca7-bee5-aa193d39cecb	4acd7593-709f-4cf9-8482-0e5fa05fa455	3b33cdbe-b9c0-48f5-ae10-70690765c792	going	2026-05-11 00:43:56.3	2026-05-11 00:44:23.038	approved
bda30d34-c1a1-4fe7-88b8-83883b1f7bf7	4acd7593-709f-4cf9-8482-0e5fa05fa455	8ad4720c-9a42-400d-8c59-f297878d08c9	going	2026-05-11 00:45:16.638	2026-05-11 00:45:16.638	pending
fb28872b-77dc-4a37-9103-d63f30f8712a	0f1cecb4-31a4-4798-bfde-d510201c0c2b	dfbf5dd5-7284-4ec6-a5af-14f3043750f3	going	2026-05-11 01:22:13.184	2026-05-11 01:22:53.308	approved
ef54419f-7b74-4200-aa58-dee322d7b9a6	0f1cecb4-31a4-4798-bfde-d510201c0c2b	3b33cdbe-b9c0-48f5-ae10-70690765c792	going	2026-05-11 01:24:44.834	2026-05-11 01:26:03.145	approved
96841f9f-0dc1-4589-9a51-82b70daeb87b	0f1cecb4-31a4-4798-bfde-d510201c0c2b	8ad4720c-9a42-400d-8c59-f297878d08c9	going	2026-05-11 01:26:32.433	2026-05-11 01:26:32.433	pending
3f64046c-51c4-4dd9-bcfa-37ee01245974	b06b5afd-0b8a-4c74-8145-54f9939c68c9	dfbf5dd5-7284-4ec6-a5af-14f3043750f3	going	2026-05-11 07:12:26.972	2026-05-11 07:12:47.16	approved
\.


--
-- Data for Name: saved_events; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.saved_events (id, user_id, event_id, created_at) FROM stdin;
c421d570-a8f5-43f5-a9bd-a8aa722aef49	dfbf5dd5-7284-4ec6-a5af-14f3043750f3	2ac5f472-f85d-4b0a-928e-c2b94d814036	2026-05-11 01:07:29.208
\.


--
-- Data for Name: ticket_types; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.ticket_types (id, event_id, name, price, quantity, sold_count, description, created_at) FROM stdin;
8b16cb7d-11ae-4a2f-8bb6-e83e57cd0b27	f046ebb6-2c2f-41dd-adf1-2f3e053867ae	General Admission	35.00	300	1	Standard entry with full access to the event.	2026-05-10 19:51:09.009
45102faf-1a63-495a-b3e3-dd41076e0188	f046ebb6-2c2f-41dd-adf1-2f3e053867ae	VIP	87.50	75	0	Premium access with reserved seating, priority entry, and exclusive perks.	2026-05-10 19:51:09.01
57dad80a-4935-4a0b-bc7a-89fdacb90f64	34ecd42f-cf58-4446-9677-15c75cc21718	Early Bird	35.00	50	3	Limited discounted tickets for early registrants.	2026-05-10 19:51:09.014
0f308ff8-d8f1-4cf6-a5df-409df0344fa4	f046ebb6-2c2f-41dd-adf1-2f3e053867ae	Early Bird	24.50	125	2	Limited discounted tickets for early registrants.	2026-05-10 19:51:09.01
02df8136-d246-4a5e-8d1c-142161664096	34ecd42f-cf58-4446-9677-15c75cc21718	General Admission	50.00	120	2	Standard entry with full access to the event.	2026-05-10 19:51:09.013
9390822f-e0f4-4f10-a4bc-1e2892b86953	1cfec7ff-898a-4816-93f0-38df61413e27	General Admission	0.00	1200	2	Standard entry with full access to the event.	2026-05-10 19:51:09.01
867eaf0c-bb31-47f7-ba11-c14a06c075a4	d172efba-7f39-4cb0-af7b-ffd23d22cf8a	VIP	375.00	2250	1	Premium access with reserved seating, priority entry, and exclusive perks.	2026-05-10 19:51:09.011
a97490ab-d05c-4aae-b916-915dda0a6e45	d172efba-7f39-4cb0-af7b-ffd23d22cf8a	General Admission	150.00	9000	2	Standard entry with full access to the event.	2026-05-10 19:51:09.011
2298c966-337e-4463-a581-6c0f00d330cc	d172efba-7f39-4cb0-af7b-ffd23d22cf8a	Early Bird	105.00	3750	1	Limited discounted tickets for early registrants.	2026-05-10 19:51:09.011
8fc21fa5-2492-42bc-874c-ad0182c7df31	a7b52b47-7a9c-4984-a304-6a91f33e3ee0	General Admission	0.00	60	3	Standard entry with full access to the event.	2026-05-10 19:51:09.011
dca3f090-43d2-4901-ae75-f9d2d6474f6e	2ac5f472-f85d-4b0a-928e-c2b94d814036	Early Bird	209.30	750	1	Limited discounted tickets for early registrants.	2026-05-10 19:51:09.012
ffe5c754-a608-446d-a87d-c4f412dd98ad	2ac5f472-f85d-4b0a-928e-c2b94d814036	General Admission	299.00	1800	1	Standard entry with full access to the event.	2026-05-10 19:51:09.011
e0839844-4480-4053-9525-ace46f348b4d	c2c88104-be03-4655-944a-30d09b4287b9	General Admission	25.00	72	3	Standard entry with full access to the event.	2026-05-10 19:51:09.014
0e463b12-2c10-4002-974e-8dadd1159346	2ac5f472-f85d-4b0a-928e-c2b94d814036	VIP	747.50	450	2	Premium access with reserved seating, priority entry, and exclusive perks.	2026-05-10 19:51:09.012
565b1817-15df-4ddb-87f1-5d305b1034ed	c2c88104-be03-4655-944a-30d09b4287b9	Early Bird	17.50	30	2	Limited discounted tickets for early registrants.	2026-05-10 19:51:09.014
839ff0cc-869c-4a63-a15c-b8330203d198	c97c5d27-0bf2-48a4-ba4e-b9ac8f7530b0	VIP	187.50	120	0	Premium access with reserved seating, priority entry, and exclusive perks.	2026-05-10 19:51:09.013
bb319e93-3335-42a3-a3ec-4b3faa7e123b	34ecd42f-cf58-4446-9677-15c75cc21718	VIP	125.00	30	0	Premium access with reserved seating, priority entry, and exclusive perks.	2026-05-10 19:51:09.013
ae970777-9b54-4b9e-bf46-afd44ac6761f	c2c88104-be03-4655-944a-30d09b4287b9	VIP	62.50	18	0	Premium access with reserved seating, priority entry, and exclusive perks.	2026-05-10 19:51:09.014
6b60af53-0ab1-4d66-86cc-9f403e343fa4	07bf468e-3ca0-4b6a-8111-36104e94d667	General Admission	40.00	150	0	Standard entry with full access to the event.	2026-05-10 19:51:09.014
aaafacf5-4f07-4310-a927-678fca92e4be	07bf468e-3ca0-4b6a-8111-36104e94d667	VIP	100.00	37	0	Premium access with reserved seating, priority entry, and exclusive perks.	2026-05-10 19:51:09.015
2a11b2b6-af0f-4f08-aad9-0f739dd555a9	07bf468e-3ca0-4b6a-8111-36104e94d667	Early Bird	28.00	62	0	Limited discounted tickets for early registrants.	2026-05-10 19:51:09.015
e3d47153-6ba3-46b7-8aaa-21abdfb16c28	2b07fc79-e45c-44c9-a307-a6534662cba4	General Admission	120.00	36	0	Standard entry with full access to the event.	2026-05-10 19:51:09.015
924c7160-7236-4775-bca6-d26fd8c8d704	fb8fa0f6-b1a4-40e5-a3e4-443c32c3273e	General Admission	0.00	90	4	Standard entry with full access to the event.	2026-05-10 19:51:09.012
bbeb198e-97c9-4121-8900-4f8ea26fbbce	c97c5d27-0bf2-48a4-ba4e-b9ac8f7530b0	General Admission	75.00	480	1	Standard entry with full access to the event.	2026-05-10 19:51:09.012
3a52f56c-ce4d-4eb6-a65d-280d238e4b14	c97c5d27-0bf2-48a4-ba4e-b9ac8f7530b0	Early Bird	52.50	200	1	Limited discounted tickets for early registrants.	2026-05-10 19:51:09.013
5f918aa4-20ee-46cd-a0d1-ad476bbbf05c	2cf78b12-a368-4b7a-8d21-e426bded960f	VIP	37.50	75	2	Premium access with reserved seating, priority entry, and exclusive perks.	2026-05-10 19:51:09.025
d934a632-b4ed-4db0-87e8-5a80509e9f63	9cd65740-db70-43a9-acd0-fc109be876e8	General Admission	65.00	24	0	Standard entry with full access to the event.	2026-05-10 19:51:09.016
9fb73f6d-f308-4e29-9bdb-e456c6737b48	9cd65740-db70-43a9-acd0-fc109be876e8	VIP	162.50	6	0	Premium access with reserved seating, priority entry, and exclusive perks.	2026-05-10 19:51:09.016
884eab6a-be05-48a0-ab5c-d9b4ab0e977a	411b6e28-133c-43ed-8255-767bcf6f2b85	Early Bird	59.50	5	0	Limited discounted tickets for early registrants.	2026-05-10 19:51:09.017
ef11dd14-6638-492d-89b4-0ff4ef7ecbf0	6906dbb4-e860-4b46-98de-5f47f657446d	General Admission	45.00	1200	0	Standard entry with full access to the event.	2026-05-10 19:51:09.018
7852b389-27d7-4fc8-85c9-f6b9251574f4	5738c771-8041-4191-839f-767d8711d766	VIP	75.00	45	0	Premium access with reserved seating, priority entry, and exclusive perks.	2026-05-10 19:51:09.02
5c8ad79e-e647-457f-a14f-4998d180a87f	5738c771-8041-4191-839f-767d8711d766	Early Bird	21.00	75	0	Limited discounted tickets for early registrants.	2026-05-10 19:51:09.02
945604a5-65c8-467a-9730-e7251f5fb674	d85c5e53-d378-4a0f-9251-a3fc4a9c725a	General Admission	20.00	30	0	Standard entry with full access to the event.	2026-05-10 19:51:09.02
d3677fe6-2e28-4f85-8e1e-87a1a8ede286	d85c5e53-d378-4a0f-9251-a3fc4a9c725a	VIP	50.00	7	0	Premium access with reserved seating, priority entry, and exclusive perks.	2026-05-10 19:51:09.02
bcd23451-b3bc-43e0-b61b-2a72635630eb	d85c5e53-d378-4a0f-9251-a3fc4a9c725a	Early Bird	14.00	12	0	Limited discounted tickets for early registrants.	2026-05-10 19:51:09.021
34e60018-ae08-47fe-ac1d-50944f610a06	d56761da-f672-4b5d-85c5-d338f70f763f	General Admission	55.00	21	0	Standard entry with full access to the event.	2026-05-10 19:51:09.021
e5984858-991d-49ee-8fdb-c322a746362e	d9bcead1-664a-4442-b319-64ee76d2de5f	General Admission	199.00	36	0	Standard entry with full access to the event.	2026-05-10 19:51:09.022
b0cd9e10-2868-4b62-aa8c-b98f583bcc23	c47f8482-ee31-4ef6-8615-d00a57dccc33	General Admission	0.00	60	0	Standard entry with full access to the event.	2026-05-10 19:51:09.024
1e87525b-8187-4408-98ec-70481fc5abd6	de268477-60b2-45ab-ac2f-da9a1b267613	General Admission	200.00	240	0	Standard entry with full access to the event.	2026-05-10 19:51:09.024
3f8c6732-1c1a-45c1-a3c0-b1e909e5862a	de268477-60b2-45ab-ac2f-da9a1b267613	Early Bird	140.00	100	0	Limited discounted tickets for early registrants.	2026-05-10 19:51:09.024
992425e3-cc77-4cf8-9da3-fb5e6926bab2	2cf78b12-a368-4b7a-8d21-e426bded960f	General Admission	15.00	300	0	Standard entry with full access to the event.	2026-05-10 19:51:09.025
239f8547-a9c0-4498-93ec-51a0d85de0e2	14402a1b-247f-4b46-a573-2169ecb7e00b	General Admission	149.00	15	0	Standard entry with full access to the event.	2026-05-10 19:51:09.026
b5abc2b6-efa9-4811-803d-09ba80ef443f	14402a1b-247f-4b46-a573-2169ecb7e00b	VIP	372.50	5	0	Premium access with reserved seating, priority entry, and exclusive perks.	2026-05-10 19:51:09.026
b47baf0f-ace7-476b-be91-ba4d3c3b79f2	427568e3-84ab-4ab4-a8e0-ef2a50cddfc3	General Admission	175.00	30	0	Standard entry with full access to the event.	2026-05-10 19:51:09.026
a82ae361-8062-45b9-bcfd-3f7a80cd9978	427568e3-84ab-4ab4-a8e0-ef2a50cddfc3	VIP	437.50	7	0	Premium access with reserved seating, priority entry, and exclusive perks.	2026-05-10 19:51:09.027
270063e0-349e-459b-8136-37ea52ce5b4a	427568e3-84ab-4ab4-a8e0-ef2a50cddfc3	Early Bird	122.50	12	0	Limited discounted tickets for early registrants.	2026-05-10 19:51:09.027
0c121716-0ca1-4b33-8b54-eb4b2a8dcadd	c5b66002-ba70-40e3-ab28-92aabe705226	General Admission	70.00	18	0	Standard entry with full access to the event.	2026-05-10 19:51:09.027
75054d35-0e7c-49f2-b94e-b5206b399a09	2b07fc79-e45c-44c9-a307-a6534662cba4	Early Bird	84.00	15	1	Limited discounted tickets for early registrants.	2026-05-10 19:51:09.016
51dadfef-5cba-44e7-ab2a-74f777ca5d0a	9cd65740-db70-43a9-acd0-fc109be876e8	Early Bird	45.50	10	1	Limited discounted tickets for early registrants.	2026-05-10 19:51:09.017
e15a836b-b713-4dca-b6be-01275ab4f1e9	c1b003ab-e528-4232-a792-3c9de624bb39	General Admission	0.00	3000	4	Standard entry with full access to the event.	2026-05-10 19:51:09.016
e778a417-3189-4ace-ae6b-2fd2c3ca8816	411b6e28-133c-43ed-8255-767bcf6f2b85	General Admission	85.00	12	1	Standard entry with full access to the event.	2026-05-10 19:51:09.017
964ad21e-012f-438e-aaf8-644e059e8e05	411b6e28-133c-43ed-8255-767bcf6f2b85	VIP	212.50	5	1	Premium access with reserved seating, priority entry, and exclusive perks.	2026-05-10 19:51:09.017
86303f45-aa8f-41c6-9313-4cda4d9e08f0	02b07105-7cf1-4dd4-bb1b-344b5d336478	Early Bird	31.50	7	1	Limited discounted tickets for early registrants.	2026-05-10 19:51:09.018
7fbbca12-8f8a-4f63-9471-d7aceb952ba0	52c1f25a-715e-40c0-a209-8e1e31271870	General Admission	0.00	600	4	Standard entry with full access to the event.	2026-05-10 19:51:09.017
7e77a0e1-547c-4ebe-a92f-ae6db72aeef2	02b07105-7cf1-4dd4-bb1b-344b5d336478	VIP	112.50	5	1	Premium access with reserved seating, priority entry, and exclusive perks.	2026-05-10 19:51:09.018
6d40bebb-a2cd-496b-a48d-f3bfa3ae1497	02b07105-7cf1-4dd4-bb1b-344b5d336478	General Admission	45.00	18	2	Standard entry with full access to the event.	2026-05-10 19:51:09.018
a636864b-67d0-4da5-9371-2d9d66b2a7a7	6906dbb4-e860-4b46-98de-5f47f657446d	Early Bird	31.50	500	1	Limited discounted tickets for early registrants.	2026-05-10 19:51:09.019
976f9bd7-eb25-41e0-aa3e-c6cbd77b069d	b3bb968f-c020-4544-9587-a4f32da93a18	General Admission	0.00	120	2	Standard entry with full access to the event.	2026-05-10 19:51:09.018
a614d690-fa5c-4481-a130-f4939ed02a2f	6906dbb4-e860-4b46-98de-5f47f657446d	VIP	112.50	300	1	Premium access with reserved seating, priority entry, and exclusive perks.	2026-05-10 19:51:09.019
dfc17946-8484-4de6-8ce7-90927508cea6	0691332a-c040-47e5-81d4-038fec940b13	General Admission	0.00	120	1	Standard entry with full access to the event.	2026-05-10 19:51:09.019
77a9d6aa-73da-46a8-a3e3-b46b2d9840e2	5738c771-8041-4191-839f-767d8711d766	General Admission	30.00	180	1	Standard entry with full access to the event.	2026-05-10 19:51:09.019
af20df6b-b71b-48a5-a683-67e4841c86e6	59434da7-65f3-4772-befe-5397ca143b26	General Admission	0.00	48	1	Standard entry with full access to the event.	2026-05-10 19:51:09.02
cfd7e55f-21d7-47cd-a150-9a210cdb11f2	d56761da-f672-4b5d-85c5-d338f70f763f	VIP	137.50	5	1	Premium access with reserved seating, priority entry, and exclusive perks.	2026-05-10 19:51:09.021
5d15d222-b4a9-4fea-9a86-6f23f3fe22d7	d56761da-f672-4b5d-85c5-d338f70f763f	Early Bird	38.50	8	1	Limited discounted tickets for early registrants.	2026-05-10 19:51:09.021
e3bebce7-e9b5-447e-be46-afec921a4dc0	2b91e9e6-47c8-4c86-aa24-7ed248cfa174	General Admission	0.00	300	1	Standard entry with full access to the event.	2026-05-10 19:51:09.022
072eae31-32b8-447a-a8fe-964f383c4901	5afdcfa9-56f6-45f2-8353-d210835a8072	General Admission	0.00	90	3	Standard entry with full access to the event.	2026-05-10 19:51:09.022
5e8f31d3-2a77-4c3e-bfdf-7ba49723a5a1	528adf3c-d30c-4586-93ce-acc8f5ce1d77	General Admission	0.00	1800	3	Standard entry with full access to the event.	2026-05-10 19:51:09.022
73c75c76-9fe4-4349-b773-92fdf44ad733	ea5525cb-f083-4dfa-a9fc-d5f9b041b1df	General Admission	89.00	24	1	Standard entry with full access to the event.	2026-05-10 19:51:09.023
43a0c318-3d84-438c-8d0b-538070a34e4c	d9bcead1-664a-4442-b319-64ee76d2de5f	VIP	497.50	9	1	Premium access with reserved seating, priority entry, and exclusive perks.	2026-05-10 19:51:09.023
a7cea138-58de-4008-92d0-19135804d644	d9bcead1-664a-4442-b319-64ee76d2de5f	Early Bird	139.30	15	2	Limited discounted tickets for early registrants.	2026-05-10 19:51:09.023
6735b57d-998d-4bf7-91ea-63807e6a77d4	ea5525cb-f083-4dfa-a9fc-d5f9b041b1df	VIP	222.50	6	1	Premium access with reserved seating, priority entry, and exclusive perks.	2026-05-10 19:51:09.023
7b3853e5-2fef-4d25-b402-c5d231c192c5	2cf78b12-a368-4b7a-8d21-e426bded960f	Early Bird	10.50	125	3	Limited discounted tickets for early registrants.	2026-05-10 19:51:09.025
f219e7c2-726c-47c6-9f3a-3bb1c8e96aae	ea5525cb-f083-4dfa-a9fc-d5f9b041b1df	Early Bird	62.30	10	2	Limited discounted tickets for early registrants.	2026-05-10 19:51:09.024
dde9abd1-b045-4ac1-9765-df5b4d66740e	2d41214e-687e-4af0-972d-5b1752745562	General Admission	0.00	300	1	Standard entry with full access to the event.	2026-05-10 19:51:09.025
45d69e24-f70c-4999-aa0f-6b0cfa47836f	cb4deeee-eda0-4e25-9204-86cb0be18a4a	General Admission	0.00	120	2	Standard entry with full access to the event.	2026-05-10 19:51:09.025
4fbe0913-aeb6-4609-84f2-6fda9e5b0498	14402a1b-247f-4b46-a573-2169ecb7e00b	Early Bird	104.30	6	1	Limited discounted tickets for early registrants.	2026-05-10 19:51:09.026
a3d92cd5-1313-4e4a-bc1c-cee2c397de47	c5b66002-ba70-40e3-ab28-92aabe705226	VIP	175.00	5	0	Premium access with reserved seating, priority entry, and exclusive perks.	2026-05-10 19:51:09.027
0f670f6f-c5f9-482c-bda2-bd5adab54d2d	c5b66002-ba70-40e3-ab28-92aabe705226	Early Bird	49.00	7	0	Limited discounted tickets for early registrants.	2026-05-10 19:51:09.028
0495c72f-071c-42d1-87e3-95dfac01f62d	2b07fc79-e45c-44c9-a307-a6534662cba4	VIP	300.00	9	1	Premium access with reserved seating, priority entry, and exclusive perks.	2026-05-10 19:51:09.015
1d816f58-ef30-49f6-890f-f5a24950e899	de268477-60b2-45ab-ac2f-da9a1b267613	VIP	500.00	60	1	Premium access with reserved seating, priority entry, and exclusive perks.	2026-05-10 19:51:09.024
\.


--
-- Data for Name: tickets; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.tickets (id, ticket_type_id, event_id, user_id, ticket_number, status, qr_code, purchase_date, amount_paid, payment_status, created_at) FROM stdin;
50fc28e8-b9d2-4ba9-8ca2-d048a2b9db70	5f918aa4-20ee-46cd-a0d1-ad476bbbf05c	2cf78b12-a368-4b7a-8d21-e426bded960f	dfbf5dd5-7284-4ec6-a5af-14f3043750f3	EVT-2026-41851	confirmed	\N	2026-05-10 23:45:40.815	37.50	completed	2026-05-10 23:45:40.816
4b2d7886-7d9c-4ade-9e4e-17ff72e52766	0f308ff8-d8f1-4cf6-a5df-409df0344fa4	f046ebb6-2c2f-41dd-adf1-2f3e053867ae	dfbf5dd5-7284-4ec6-a5af-14f3043750f3	EVT-2026-00001	confirmed	qr_bay-area-jazz-night-2026_dfbf5dd5_1	2026-05-21 23:56:00.82	24.50	completed	2026-05-10 19:51:09.029
1a13f0cf-759a-442d-b983-d06d44ee4576	8b16cb7d-11ae-4a2f-8bb6-e83e57cd0b27	f046ebb6-2c2f-41dd-adf1-2f3e053867ae	3b33cdbe-b9c0-48f5-ae10-70690765c792	EVT-2026-00002	confirmed	qr_bay-area-jazz-night-2026_3b33cdbe_2	2026-05-23 23:56:00.82	35.00	completed	2026-05-10 19:51:09.03
d8d95973-e4ad-4b48-9b13-a03c279cd398	0f308ff8-d8f1-4cf6-a5df-409df0344fa4	f046ebb6-2c2f-41dd-adf1-2f3e053867ae	f78570fc-d61a-4004-8305-47582fd8161d	EVT-2026-00003	confirmed	qr_bay-area-jazz-night-2026_f78570fc_3	2026-05-23 23:56:00.82	24.50	completed	2026-05-10 19:51:09.03
4216ab19-e699-4b5f-92a4-13c6bbb22425	9390822f-e0f4-4f10-a4bc-1e2892b86953	1cfec7ff-898a-4816-93f0-38df61413e27	326cab9a-52d9-47d9-b8ca-ddc0657ad122	EVT-2026-00004	confirmed	qr_sunnyvale-summer-concert-2026_326cab9a_4	2026-05-10 23:56:00.825	0.00	completed	2026-05-10 19:51:09.031
671caa28-4af9-4071-b337-e2f68692be6d	9390822f-e0f4-4f10-a4bc-1e2892b86953	1cfec7ff-898a-4816-93f0-38df61413e27	3b33cdbe-b9c0-48f5-ae10-70690765c792	EVT-2026-00005	confirmed	qr_sunnyvale-summer-concert-2026_3b33cdbe_5	2026-05-16 23:56:00.825	0.00	completed	2026-05-10 19:51:09.032
8432f4df-dedb-436a-9c07-ee6d9119c44f	a97490ab-d05c-4aae-b916-915dda0a6e45	d172efba-7f39-4cb0-af7b-ffd23d22cf8a	462f1084-506b-41bc-8f52-48cd139111da	EVT-2026-00006	confirmed	qr_electronic-music-festival-2026_462f1084_6	2026-05-10 23:56:00.826	150.00	completed	2026-05-10 19:51:09.032
c962be9a-a324-46ac-ba20-af352f6450b9	867eaf0c-bb31-47f7-ba11-c14a06c075a4	d172efba-7f39-4cb0-af7b-ffd23d22cf8a	326cab9a-52d9-47d9-b8ca-ddc0657ad122	EVT-2026-00007	confirmed	qr_electronic-music-festival-2026_326cab9a_7	2026-05-17 23:56:00.826	375.00	completed	2026-05-10 19:51:09.033
5f6c2d0c-6163-4032-9f6e-11787001b3ef	a97490ab-d05c-4aae-b916-915dda0a6e45	d172efba-7f39-4cb0-af7b-ffd23d22cf8a	8ad4720c-9a42-400d-8c59-f297878d08c9	EVT-2026-00008	confirmed	qr_electronic-music-festival-2026_8ad4720c_8	2026-05-20 23:56:00.826	150.00	completed	2026-05-10 19:51:09.033
88a7f99e-1308-4516-826d-1239f3bdb273	867eaf0c-bb31-47f7-ba11-c14a06c075a4	d172efba-7f39-4cb0-af7b-ffd23d22cf8a	ecf9e6ba-edc3-4194-8e8f-1166e432d4db	EVT-2026-00009	cancelled	qr_electronic-music-festival-2026_ecf9e6ba_9	2026-05-20 23:56:00.826	375.00	refunded	2026-05-10 19:51:09.034
4f3ddbf1-6548-4d57-8b16-81c43274eebf	2298c966-337e-4463-a581-6c0f00d330cc	d172efba-7f39-4cb0-af7b-ffd23d22cf8a	dfbf5dd5-7284-4ec6-a5af-14f3043750f3	EVT-2026-00010	confirmed	qr_electronic-music-festival-2026_dfbf5dd5_10	2026-05-12 23:56:00.826	105.00	completed	2026-05-10 19:51:09.034
4f270303-272d-4606-a443-3b09012638f8	8fc21fa5-2492-42bc-874c-ad0182c7df31	a7b52b47-7a9c-4984-a304-6a91f33e3ee0	8ad4720c-9a42-400d-8c59-f297878d08c9	EVT-2026-00011	confirmed	qr_acoustic-open-mic-night-sj_8ad4720c_11	2026-05-12 23:56:00.828	0.00	completed	2026-05-10 19:51:09.035
32bc0ff3-cf09-4421-892c-89975968ece3	8fc21fa5-2492-42bc-874c-ad0182c7df31	a7b52b47-7a9c-4984-a304-6a91f33e3ee0	dfbf5dd5-7284-4ec6-a5af-14f3043750f3	EVT-2026-00012	confirmed	qr_acoustic-open-mic-night-sj_dfbf5dd5_12	2026-05-11 23:56:00.828	0.00	completed	2026-05-10 19:51:09.035
4ee7e161-ca62-46ee-bcdf-609a03fbf2a1	8fc21fa5-2492-42bc-874c-ad0182c7df31	a7b52b47-7a9c-4984-a304-6a91f33e3ee0	462f1084-506b-41bc-8f52-48cd139111da	EVT-2026-00013	confirmed	qr_acoustic-open-mic-night-sj_462f1084_13	2026-05-20 23:56:00.828	0.00	completed	2026-05-10 19:51:09.036
b3c12e81-9e67-43e4-b590-eb4dca4c9179	dca3f090-43d2-4901-ae75-f9d2d6474f6e	2ac5f472-f85d-4b0a-928e-c2b94d814036	dfbf5dd5-7284-4ec6-a5af-14f3043750f3	EVT-2026-00014	confirmed	qr_sv-ai-ml-summit-2026_dfbf5dd5_14	2026-05-22 23:56:00.829	209.30	completed	2026-05-10 19:51:09.036
e2de8792-a3c0-496c-970e-de5cc86845f9	ffe5c754-a608-446d-a87d-c4f412dd98ad	2ac5f472-f85d-4b0a-928e-c2b94d814036	3b33cdbe-b9c0-48f5-ae10-70690765c792	EVT-2026-00015	confirmed	qr_sv-ai-ml-summit-2026_3b33cdbe_15	2026-05-17 23:56:00.829	299.00	completed	2026-05-10 19:51:09.037
55495ad2-3a34-4310-bc0c-c2ede806f4a6	ffe5c754-a608-446d-a87d-c4f412dd98ad	2ac5f472-f85d-4b0a-928e-c2b94d814036	ecf9e6ba-edc3-4194-8e8f-1166e432d4db	EVT-2026-00016	cancelled	qr_sv-ai-ml-summit-2026_ecf9e6ba_16	2026-05-14 23:56:00.829	299.00	refunded	2026-05-10 19:51:09.037
9343839b-2647-4334-a60b-56d19fb95b32	0e463b12-2c10-4002-974e-8dadd1159346	2ac5f472-f85d-4b0a-928e-c2b94d814036	f78570fc-d61a-4004-8305-47582fd8161d	EVT-2026-00017	confirmed	qr_sv-ai-ml-summit-2026_f78570fc_17	2026-05-23 23:56:00.829	747.50	completed	2026-05-10 19:51:09.038
c2dfa0bf-403f-4ec9-9e58-7bbd6146d38b	0e463b12-2c10-4002-974e-8dadd1159346	2ac5f472-f85d-4b0a-928e-c2b94d814036	462f1084-506b-41bc-8f52-48cd139111da	EVT-2026-00018	confirmed	qr_sv-ai-ml-summit-2026_462f1084_18	2026-05-15 23:56:00.829	747.50	completed	2026-05-10 19:51:09.038
b7ddea0b-baa7-40e9-96c4-a576c9a5b2ac	924c7160-7236-4775-bca6-d26fd8c8d704	fb8fa0f6-b1a4-40e5-a3e4-443c32c3273e	3b33cdbe-b9c0-48f5-ae10-70690765c792	EVT-2026-00019	confirmed	qr_react-nextjs-meetup-mv-2026_3b33cdbe_19	2026-05-15 23:56:00.83	0.00	completed	2026-05-10 19:51:09.041
9275e6d4-c0dd-49e2-a9de-5688ec7187a1	924c7160-7236-4775-bca6-d26fd8c8d704	fb8fa0f6-b1a4-40e5-a3e4-443c32c3273e	dfbf5dd5-7284-4ec6-a5af-14f3043750f3	EVT-2026-00020	confirmed	qr_react-nextjs-meetup-mv-2026_dfbf5dd5_20	2026-05-12 23:56:00.83	0.00	completed	2026-05-10 19:51:09.041
4cb866c1-929c-4d33-b3b1-c6ed0a45c114	924c7160-7236-4775-bca6-d26fd8c8d704	fb8fa0f6-b1a4-40e5-a3e4-443c32c3273e	f78570fc-d61a-4004-8305-47582fd8161d	EVT-2026-00021	cancelled	qr_react-nextjs-meetup-mv-2026_f78570fc_21	2026-05-19 23:56:00.83	0.00	refunded	2026-05-10 19:51:09.042
2a8dde9c-52ab-4e09-a889-dd465cf9e0a6	924c7160-7236-4775-bca6-d26fd8c8d704	fb8fa0f6-b1a4-40e5-a3e4-443c32c3273e	462f1084-506b-41bc-8f52-48cd139111da	EVT-2026-00022	confirmed	qr_react-nextjs-meetup-mv-2026_462f1084_22	2026-05-20 23:56:00.83	0.00	completed	2026-05-10 19:51:09.042
7dd66a6e-7862-421c-a034-b59b58a321fb	924c7160-7236-4775-bca6-d26fd8c8d704	fb8fa0f6-b1a4-40e5-a3e4-443c32c3273e	8ad4720c-9a42-400d-8c59-f297878d08c9	EVT-2026-00023	confirmed	qr_react-nextjs-meetup-mv-2026_8ad4720c_23	2026-05-23 23:56:00.83	0.00	completed	2026-05-10 19:51:09.043
58dd1dd1-50c0-4337-b626-55838a4ed880	bbeb198e-97c9-4121-8900-4f8ea26fbbce	c97c5d27-0bf2-48a4-ba4e-b9ac8f7530b0	326cab9a-52d9-47d9-b8ca-ddc0657ad122	EVT-2026-00024	confirmed	qr_women-in-tech-conf-2026_326cab9a_24	2026-05-14 23:56:00.831	75.00	completed	2026-05-10 19:51:09.043
3c1d3f12-cbfd-4ad3-b5f0-ddd5fe1c9980	3a52f56c-ce4d-4eb6-a65d-280d238e4b14	c97c5d27-0bf2-48a4-ba4e-b9ac8f7530b0	f78570fc-d61a-4004-8305-47582fd8161d	EVT-2026-00025	confirmed	qr_women-in-tech-conf-2026_f78570fc_25	2026-05-14 23:56:00.831	52.50	completed	2026-05-10 19:51:09.044
b17bc80b-f3e8-4426-8785-4256f6697983	57dad80a-4935-4a0b-bc7a-89fdacb90f64	34ecd42f-cf58-4446-9677-15c75cc21718	f78570fc-d61a-4004-8305-47582fd8161d	EVT-2026-00026	confirmed	qr_startup-weekend-sj-2026_f78570fc_26	2026-05-18 23:56:00.832	35.00	completed	2026-05-10 19:51:09.044
77e582e1-1bad-444d-b16b-0403ce45c545	57dad80a-4935-4a0b-bc7a-89fdacb90f64	34ecd42f-cf58-4446-9677-15c75cc21718	3b33cdbe-b9c0-48f5-ae10-70690765c792	EVT-2026-00027	confirmed	qr_startup-weekend-sj-2026_3b33cdbe_27	2026-05-16 23:56:00.832	35.00	completed	2026-05-10 19:51:09.045
f95a82aa-9d95-4bd2-ad52-5f12690fec85	02df8136-d246-4a5e-8d1c-142161664096	34ecd42f-cf58-4446-9677-15c75cc21718	dfbf5dd5-7284-4ec6-a5af-14f3043750f3	EVT-2026-00028	confirmed	qr_startup-weekend-sj-2026_dfbf5dd5_28	2026-05-20 23:56:00.832	50.00	completed	2026-05-10 19:51:09.045
8aa0b6d3-d405-4312-9273-2d637b7840fb	57dad80a-4935-4a0b-bc7a-89fdacb90f64	34ecd42f-cf58-4446-9677-15c75cc21718	462f1084-506b-41bc-8f52-48cd139111da	EVT-2026-00029	confirmed	qr_startup-weekend-sj-2026_462f1084_29	2026-05-22 23:56:00.832	35.00	completed	2026-05-10 19:51:09.046
992ebc49-7531-4a59-a0e6-846bbed5e4dd	02df8136-d246-4a5e-8d1c-142161664096	34ecd42f-cf58-4446-9677-15c75cc21718	ecf9e6ba-edc3-4194-8e8f-1166e432d4db	EVT-2026-00030	confirmed	qr_startup-weekend-sj-2026_ecf9e6ba_30	2026-05-23 23:56:00.832	50.00	completed	2026-05-10 19:51:09.047
0f3b10c1-743b-4e15-a364-230d33336b58	565b1817-15df-4ddb-87f1-5d305b1034ed	c2c88104-be03-4655-944a-30d09b4287b9	326cab9a-52d9-47d9-b8ca-ddc0657ad122	EVT-2026-00031	confirmed	qr_ba-entrepreneurs-mixer-2026_326cab9a_31	2026-05-17 23:56:00.832	17.50	completed	2026-05-10 19:51:09.047
8d5b9c14-e77f-472a-8ef2-63ca0de63b1a	e0839844-4480-4053-9525-ace46f348b4d	c2c88104-be03-4655-944a-30d09b4287b9	dfbf5dd5-7284-4ec6-a5af-14f3043750f3	EVT-2026-00032	confirmed	qr_ba-entrepreneurs-mixer-2026_dfbf5dd5_32	2026-05-16 23:56:00.832	25.00	completed	2026-05-10 19:51:09.048
1cc48249-f0b9-4abf-b921-53f2962237bf	e0839844-4480-4053-9525-ace46f348b4d	c2c88104-be03-4655-944a-30d09b4287b9	8ad4720c-9a42-400d-8c59-f297878d08c9	EVT-2026-00033	confirmed	qr_ba-entrepreneurs-mixer-2026_8ad4720c_33	2026-05-22 23:56:00.832	25.00	completed	2026-05-10 19:51:09.048
22479ba0-ab39-4d48-8d36-a0cd2be862e9	e0839844-4480-4053-9525-ace46f348b4d	c2c88104-be03-4655-944a-30d09b4287b9	462f1084-506b-41bc-8f52-48cd139111da	EVT-2026-00034	confirmed	qr_ba-entrepreneurs-mixer-2026_462f1084_34	2026-05-19 23:56:00.832	25.00	completed	2026-05-10 19:51:09.049
57351077-7835-4b13-b820-562a27b9394d	565b1817-15df-4ddb-87f1-5d305b1034ed	c2c88104-be03-4655-944a-30d09b4287b9	3b33cdbe-b9c0-48f5-ae10-70690765c792	EVT-2026-00035	confirmed	qr_ba-entrepreneurs-mixer-2026_3b33cdbe_35	2026-05-11 23:56:00.832	17.50	completed	2026-05-10 19:51:09.049
bb1bbf96-b265-482c-8f05-a7b20378c6d4	0495c72f-071c-42d1-87e3-95dfac01f62d	2b07fc79-e45c-44c9-a307-a6534662cba4	3b33cdbe-b9c0-48f5-ae10-70690765c792	EVT-2026-00036	confirmed	qr_digital-marketing-masterclass-2026_3b33cdbe_36	2026-05-13 23:56:00.834	300.00	completed	2026-05-10 19:51:09.05
fa566c82-98ad-41cb-807a-b2882ccb1627	e3d47153-6ba3-46b7-8aaa-21abdfb16c28	2b07fc79-e45c-44c9-a307-a6534662cba4	462f1084-506b-41bc-8f52-48cd139111da	EVT-2026-00037	cancelled	qr_digital-marketing-masterclass-2026_462f1084_37	2026-05-20 23:56:00.834	120.00	refunded	2026-05-10 19:51:09.05
fea72b2a-6f1b-46fb-a3b6-421a5721eaf3	75054d35-0e7c-49f2-b94e-b5206b399a09	2b07fc79-e45c-44c9-a307-a6534662cba4	ecf9e6ba-edc3-4194-8e8f-1166e432d4db	EVT-2026-00038	confirmed	qr_digital-marketing-masterclass-2026_ecf9e6ba_38	2026-05-10 23:56:00.834	84.00	completed	2026-05-10 19:51:09.051
24e39947-8680-4872-a13e-6a71da5a80d5	e15a836b-b713-4dca-b6be-01275ab4f1e9	c1b003ab-e528-4232-a792-3c9de624bb39	dfbf5dd5-7284-4ec6-a5af-14f3043750f3	EVT-2026-00039	confirmed	qr_sj-food-truck-festival-2026_dfbf5dd5_39	2026-05-16 23:56:00.835	0.00	completed	2026-05-10 19:51:09.051
622026b2-8213-474b-9026-dc6c569062db	e15a836b-b713-4dca-b6be-01275ab4f1e9	c1b003ab-e528-4232-a792-3c9de624bb39	3b33cdbe-b9c0-48f5-ae10-70690765c792	EVT-2026-00040	confirmed	qr_sj-food-truck-festival-2026_3b33cdbe_40	2026-05-14 23:56:00.835	0.00	completed	2026-05-10 19:51:09.052
6fa0beb2-1c8c-44f4-b6b3-44bf5e97d7e1	e15a836b-b713-4dca-b6be-01275ab4f1e9	c1b003ab-e528-4232-a792-3c9de624bb39	462f1084-506b-41bc-8f52-48cd139111da	EVT-2026-00041	confirmed	qr_sj-food-truck-festival-2026_462f1084_41	2026-05-15 23:56:00.835	0.00	completed	2026-05-10 19:51:09.052
2f1fceda-d009-40b9-9c18-581aff70c089	e15a836b-b713-4dca-b6be-01275ab4f1e9	c1b003ab-e528-4232-a792-3c9de624bb39	ecf9e6ba-edc3-4194-8e8f-1166e432d4db	EVT-2026-00042	confirmed	qr_sj-food-truck-festival-2026_ecf9e6ba_42	2026-05-11 23:56:00.835	0.00	completed	2026-05-10 19:51:09.053
6921b94c-df07-4b18-bee8-468693281d75	51dadfef-5cba-44e7-ab2a-74f777ca5d0a	9cd65740-db70-43a9-acd0-fc109be876e8	f78570fc-d61a-4004-8305-47582fd8161d	EVT-2026-00043	confirmed	qr_california-pinot-noir-tasting-2026_f78570fc_43	2026-05-23 23:56:00.836	45.50	completed	2026-05-10 19:51:09.054
d858deca-4cda-42b2-a98b-167f5b56c4e4	e778a417-3189-4ace-ae6b-2fd2c3ca8816	411b6e28-133c-43ed-8255-767bcf6f2b85	f78570fc-d61a-4004-8305-47582fd8161d	EVT-2026-00044	confirmed	qr_sushi-making-workshop-2026_f78570fc_44	2026-05-21 23:56:00.837	85.00	completed	2026-05-10 19:51:09.055
a92a74c5-3a5e-4262-b92c-1402a4972bce	964ad21e-012f-438e-aaf8-644e059e8e05	411b6e28-133c-43ed-8255-767bcf6f2b85	dfbf5dd5-7284-4ec6-a5af-14f3043750f3	EVT-2026-00045	confirmed	qr_sushi-making-workshop-2026_dfbf5dd5_45	2026-05-21 23:56:00.837	212.50	completed	2026-05-10 19:51:09.055
4bcb18ac-b804-4bca-9975-2bcecc8f6a61	7fbbca12-8f8a-4f63-9471-d7aceb952ba0	52c1f25a-715e-40c0-a209-8e1e31271870	dfbf5dd5-7284-4ec6-a5af-14f3043750f3	EVT-2026-00046	cancelled	qr_south-bay-art-walk-2026_dfbf5dd5_46	2026-05-16 23:56:00.838	0.00	refunded	2026-05-10 19:51:09.056
7902c785-b59e-4882-842e-5606d3a4136e	7fbbca12-8f8a-4f63-9471-d7aceb952ba0	52c1f25a-715e-40c0-a209-8e1e31271870	462f1084-506b-41bc-8f52-48cd139111da	EVT-2026-00047	confirmed	qr_south-bay-art-walk-2026_462f1084_47	2026-05-18 23:56:00.838	0.00	completed	2026-05-10 19:51:09.057
cb0d3a0d-5529-4f89-92a2-99eaf787856e	7fbbca12-8f8a-4f63-9471-d7aceb952ba0	52c1f25a-715e-40c0-a209-8e1e31271870	f78570fc-d61a-4004-8305-47582fd8161d	EVT-2026-00048	confirmed	qr_south-bay-art-walk-2026_f78570fc_48	2026-05-19 23:56:00.838	0.00	completed	2026-05-10 19:51:09.057
6a58c0ad-d38b-4d3e-bdce-d538186e5f19	7fbbca12-8f8a-4f63-9471-d7aceb952ba0	52c1f25a-715e-40c0-a209-8e1e31271870	326cab9a-52d9-47d9-b8ca-ddc0657ad122	EVT-2026-00049	confirmed	qr_south-bay-art-walk-2026_326cab9a_49	2026-05-23 23:56:00.838	0.00	completed	2026-05-10 19:51:09.058
d9f56fa7-1cbc-410b-93d0-93d2fccb623d	7fbbca12-8f8a-4f63-9471-d7aceb952ba0	52c1f25a-715e-40c0-a209-8e1e31271870	ecf9e6ba-edc3-4194-8e8f-1166e432d4db	EVT-2026-00050	confirmed	qr_south-bay-art-walk-2026_ecf9e6ba_50	2026-05-12 23:56:00.838	0.00	completed	2026-05-10 19:51:09.058
8d82e45c-b7c7-4349-8305-4c0ca624f960	6d40bebb-a2cd-496b-a48d-f3bfa3ae1497	02b07105-7cf1-4dd4-bb1b-344b5d336478	462f1084-506b-41bc-8f52-48cd139111da	EVT-2026-00051	confirmed	qr_watercolor-workshop-pa-2026_462f1084_51	2026-05-21 23:56:00.839	45.00	completed	2026-05-10 19:51:09.059
eebae4a4-dd64-43d8-8951-d28b358d5193	7e77a0e1-547c-4ebe-a92f-ae6db72aeef2	02b07105-7cf1-4dd4-bb1b-344b5d336478	dfbf5dd5-7284-4ec6-a5af-14f3043750f3	EVT-2026-00052	confirmed	qr_watercolor-workshop-pa-2026_dfbf5dd5_52	2026-05-15 23:56:00.839	112.50	completed	2026-05-10 19:51:09.06
751a133c-5c6a-43d6-a94d-17aa0765829a	6d40bebb-a2cd-496b-a48d-f3bfa3ae1497	02b07105-7cf1-4dd4-bb1b-344b5d336478	8ad4720c-9a42-400d-8c59-f297878d08c9	EVT-2026-00053	confirmed	qr_watercolor-workshop-pa-2026_8ad4720c_53	2026-05-11 23:56:00.839	45.00	completed	2026-05-10 19:51:09.06
76794014-597a-45e7-aa85-b73326c186ae	86303f45-aa8f-41c6-9313-4cda4d9e08f0	02b07105-7cf1-4dd4-bb1b-344b5d336478	ecf9e6ba-edc3-4194-8e8f-1166e432d4db	EVT-2026-00054	confirmed	qr_watercolor-workshop-pa-2026_ecf9e6ba_54	2026-05-12 23:56:00.839	31.50	completed	2026-05-10 19:51:09.061
cbbd17ed-6ab0-4253-9a7c-3575836ee454	976f9bd7-eb25-41e0-aa3e-c6cbd77b069d	b3bb968f-c020-4544-9587-a4f32da93a18	3b33cdbe-b9c0-48f5-ae10-70690765c792	EVT-2026-00055	confirmed	qr_photography-urban-landscapes-2026_3b33cdbe_55	2026-05-18 23:56:00.84	0.00	completed	2026-05-10 19:51:09.061
77caac71-6a59-450a-a07d-60bfdd1d92cd	976f9bd7-eb25-41e0-aa3e-c6cbd77b069d	b3bb968f-c020-4544-9587-a4f32da93a18	ecf9e6ba-edc3-4194-8e8f-1166e432d4db	EVT-2026-00056	confirmed	qr_photography-urban-landscapes-2026_ecf9e6ba_56	2026-05-15 23:56:00.84	0.00	completed	2026-05-10 19:51:09.062
1a4b8172-2d30-4fd9-bed4-8eb31d18a01f	a636864b-67d0-4da5-9371-2d9d66b2a7a7	6906dbb4-e860-4b46-98de-5f47f657446d	ecf9e6ba-edc3-4194-8e8f-1166e432d4db	EVT-2026-00057	confirmed	qr_sj-10k-charity-run-2026_ecf9e6ba_57	2026-05-23 23:56:00.841	31.50	completed	2026-05-10 19:51:09.062
9c52674c-b43f-4418-bdc0-14e422e1f0aa	a614d690-fa5c-4481-a130-f4939ed02a2f	6906dbb4-e860-4b46-98de-5f47f657446d	8ad4720c-9a42-400d-8c59-f297878d08c9	EVT-2026-00058	confirmed	qr_sj-10k-charity-run-2026_8ad4720c_58	2026-05-23 23:56:00.841	112.50	completed	2026-05-10 19:51:09.063
4f80871e-6f4a-4e66-ba35-461bf1e6ed8a	ef11dd14-6638-492d-89b4-0ff4ef7ecbf0	6906dbb4-e860-4b46-98de-5f47f657446d	3b33cdbe-b9c0-48f5-ae10-70690765c792	EVT-2026-00059	cancelled	qr_sj-10k-charity-run-2026_3b33cdbe_59	2026-05-15 23:56:00.841	45.00	refunded	2026-05-10 19:51:09.064
1748b21f-205e-4529-a5dd-d5152cdd9a3e	dfc17946-8484-4de6-8ce7-90927508cea6	0691332a-c040-47e5-81d4-038fec940b13	ecf9e6ba-edc3-4194-8e8f-1166e432d4db	EVT-2026-00060	confirmed	qr_outdoor-yoga-golden-gate-2026_ecf9e6ba_60	2026-05-14 23:56:00.842	0.00	completed	2026-05-10 19:51:09.064
f5e98c0c-1e54-46c7-a1e4-5fcb153ee7c3	77a9d6aa-73da-46a8-a3e3-b46b2d9840e2	5738c771-8041-4191-839f-767d8711d766	dfbf5dd5-7284-4ec6-a5af-14f3043750f3	EVT-2026-00061	confirmed	qr_crossfit-challenge-sc-2026_dfbf5dd5_61	2026-05-14 23:56:00.842	30.00	completed	2026-05-10 19:51:09.065
d3b98fd2-e04f-4108-b856-00f895852f73	77a9d6aa-73da-46a8-a3e3-b46b2d9840e2	5738c771-8041-4191-839f-767d8711d766	8ad4720c-9a42-400d-8c59-f297878d08c9	EVT-2026-00062	cancelled	qr_crossfit-challenge-sc-2026_8ad4720c_62	2026-05-22 23:56:00.842	30.00	refunded	2026-05-10 19:51:09.066
3e033ab5-d0dd-4682-a9e0-e0bab6622c3d	af20df6b-b71b-48a5-a683-67e4841c86e6	59434da7-65f3-4772-befe-5397ca143b26	f78570fc-d61a-4004-8305-47582fd8161d	EVT-2026-00063	confirmed	qr_mental-health-workshop-2026_f78570fc_63	2026-05-21 23:56:00.843	0.00	completed	2026-05-10 19:51:09.066
c44dea57-cbb1-409c-8547-0f27594262e7	cfd7e55f-21d7-47cd-a150-9a210cdb11f2	d56761da-f672-4b5d-85c5-d338f70f763f	3b33cdbe-b9c0-48f5-ae10-70690765c792	EVT-2026-00064	cancelled	qr_meditation-retreat-cupertino-2026_3b33cdbe_64	2026-05-15 23:56:00.845	137.50	refunded	2026-05-10 19:51:09.067
56456f86-3a54-4232-85f4-08cb64b09277	cfd7e55f-21d7-47cd-a150-9a210cdb11f2	d56761da-f672-4b5d-85c5-d338f70f763f	dfbf5dd5-7284-4ec6-a5af-14f3043750f3	EVT-2026-00065	confirmed	qr_meditation-retreat-cupertino-2026_dfbf5dd5_65	2026-05-16 23:56:00.845	137.50	completed	2026-05-10 19:51:09.067
d4b78d29-e33c-4a6a-839e-f17b2f0c5adc	5d15d222-b4a9-4fea-9a86-6f23f3fe22d7	d56761da-f672-4b5d-85c5-d338f70f763f	ecf9e6ba-edc3-4194-8e8f-1166e432d4db	EVT-2026-00066	cancelled	qr_meditation-retreat-cupertino-2026_ecf9e6ba_66	2026-05-10 23:56:00.845	38.50	refunded	2026-05-10 19:51:09.068
8b1a1aeb-327a-4758-b2f6-95752bfe005f	5d15d222-b4a9-4fea-9a86-6f23f3fe22d7	d56761da-f672-4b5d-85c5-d338f70f763f	462f1084-506b-41bc-8f52-48cd139111da	EVT-2026-00067	confirmed	qr_meditation-retreat-cupertino-2026_462f1084_67	2026-05-23 23:56:00.845	38.50	completed	2026-05-10 19:51:09.068
98f31098-0e4c-427f-ad56-72aa8ce46ae6	e3bebce7-e9b5-447e-be46-afec921a4dc0	2b91e9e6-47c8-4c86-aa24-7ed248cfa174	3b33cdbe-b9c0-48f5-ae10-70690765c792	EVT-2026-00068	confirmed	qr_neighborhood-block-party-sv-2026_3b33cdbe_68	2026-05-15 23:56:00.846	0.00	completed	2026-05-10 19:51:09.069
18153741-76b7-49a4-8c5b-f8b6c31e0f58	e3bebce7-e9b5-447e-be46-afec921a4dc0	2b91e9e6-47c8-4c86-aa24-7ed248cfa174	8ad4720c-9a42-400d-8c59-f297878d08c9	EVT-2026-00069	cancelled	qr_neighborhood-block-party-sv-2026_8ad4720c_69	2026-05-11 23:56:00.846	0.00	refunded	2026-05-10 19:51:09.069
7b5a6000-0068-4ab7-855a-ef984f8dae44	e3bebce7-e9b5-447e-be46-afec921a4dc0	2b91e9e6-47c8-4c86-aa24-7ed248cfa174	462f1084-506b-41bc-8f52-48cd139111da	EVT-2026-00070	cancelled	qr_neighborhood-block-party-sv-2026_462f1084_70	2026-05-20 23:56:00.846	0.00	refunded	2026-05-10 19:51:09.07
48a366a3-21fd-4edd-81be-ca14c6e15404	e3bebce7-e9b5-447e-be46-afec921a4dc0	2b91e9e6-47c8-4c86-aa24-7ed248cfa174	dfbf5dd5-7284-4ec6-a5af-14f3043750f3	EVT-2026-00071	cancelled	qr_neighborhood-block-party-sv-2026_dfbf5dd5_71	2026-05-23 23:56:00.846	0.00	refunded	2026-05-10 19:51:09.07
f579b64d-806b-4f6b-99ac-a9b1b9925443	072eae31-32b8-447a-a8fe-964f383c4901	5afdcfa9-56f6-45f2-8353-d210835a8072	dfbf5dd5-7284-4ec6-a5af-14f3043750f3	EVT-2026-00072	confirmed	qr_park-cleanup-volunteer-day-2026_dfbf5dd5_72	2026-05-15 23:56:00.846	0.00	completed	2026-05-10 19:51:09.07
ac4d46db-0f21-4d48-8a9b-941782345d67	072eae31-32b8-447a-a8fe-964f383c4901	5afdcfa9-56f6-45f2-8353-d210835a8072	462f1084-506b-41bc-8f52-48cd139111da	EVT-2026-00073	confirmed	qr_park-cleanup-volunteer-day-2026_462f1084_73	2026-05-10 23:56:00.846	0.00	completed	2026-05-10 19:51:09.071
82a8c87d-0454-4e85-827b-6715d6cc4760	072eae31-32b8-447a-a8fe-964f383c4901	5afdcfa9-56f6-45f2-8353-d210835a8072	3b33cdbe-b9c0-48f5-ae10-70690765c792	EVT-2026-00074	confirmed	qr_park-cleanup-volunteer-day-2026_3b33cdbe_74	2026-05-13 23:56:00.846	0.00	completed	2026-05-10 19:51:09.072
dcc1d364-e286-4db0-b25f-7dc810ad67d0	5e8f31d3-2a77-4c3e-bfdf-7ba49723a5a1	528adf3c-d30c-4586-93ce-acc8f5ce1d77	f78570fc-d61a-4004-8305-47582fd8161d	EVT-2026-00075	confirmed	qr_cultural-heritage-festival-2026_f78570fc_75	2026-05-22 23:56:00.847	0.00	completed	2026-05-10 19:51:09.073
f4fc6308-65ff-491a-8704-f455ae0bfc70	5e8f31d3-2a77-4c3e-bfdf-7ba49723a5a1	528adf3c-d30c-4586-93ce-acc8f5ce1d77	326cab9a-52d9-47d9-b8ca-ddc0657ad122	EVT-2026-00076	confirmed	qr_cultural-heritage-festival-2026_326cab9a_76	2026-05-16 23:56:00.847	0.00	completed	2026-05-10 19:51:09.073
4b5e19d3-8c54-4f80-bed9-e58d3a5e58a6	5e8f31d3-2a77-4c3e-bfdf-7ba49723a5a1	528adf3c-d30c-4586-93ce-acc8f5ce1d77	dfbf5dd5-7284-4ec6-a5af-14f3043750f3	EVT-2026-00077	confirmed	qr_cultural-heritage-festival-2026_dfbf5dd5_77	2026-05-12 23:56:00.847	0.00	completed	2026-05-10 19:51:09.074
e6f37d6a-d8d4-4609-9310-ad33794d7015	a7cea138-58de-4008-92d0-19135804d644	d9bcead1-664a-4442-b319-64ee76d2de5f	dfbf5dd5-7284-4ec6-a5af-14f3043750f3	EVT-2026-00078	confirmed	qr_python-data-science-bootcamp-2026_dfbf5dd5_78	2026-05-17 23:56:00.848	139.30	completed	2026-05-10 19:51:09.075
9f5631e7-7a06-472b-8f34-11e82be9ffa0	a7cea138-58de-4008-92d0-19135804d644	d9bcead1-664a-4442-b319-64ee76d2de5f	f78570fc-d61a-4004-8305-47582fd8161d	EVT-2026-00079	cancelled	qr_python-data-science-bootcamp-2026_f78570fc_79	2026-05-15 23:56:00.848	139.30	refunded	2026-05-10 19:51:09.075
5b5d8969-0091-406c-b298-bf6b7daec954	43a0c318-3d84-438c-8d0b-538070a34e4c	d9bcead1-664a-4442-b319-64ee76d2de5f	462f1084-506b-41bc-8f52-48cd139111da	EVT-2026-00080	confirmed	qr_python-data-science-bootcamp-2026_462f1084_80	2026-05-14 23:56:00.848	497.50	completed	2026-05-10 19:51:09.076
b1ac6bb6-2122-424e-aa24-5128192ca317	a7cea138-58de-4008-92d0-19135804d644	d9bcead1-664a-4442-b319-64ee76d2de5f	3b33cdbe-b9c0-48f5-ae10-70690765c792	EVT-2026-00081	confirmed	qr_python-data-science-bootcamp-2026_3b33cdbe_81	2026-05-15 23:56:00.848	139.30	completed	2026-05-10 19:51:09.076
368cfbdf-008c-4853-8019-8f063ade2cf1	73c75c76-9fe4-4349-b773-92fdf44ad733	ea5525cb-f083-4dfa-a9fc-d5f9b041b1df	f78570fc-d61a-4004-8305-47582fd8161d	EVT-2026-00082	confirmed	qr_public-speaking-masterclass-2026_f78570fc_82	2026-05-17 23:56:00.849	89.00	completed	2026-05-10 19:51:09.077
9fab9017-18c2-4e7f-ac6e-80552b940c71	6735b57d-998d-4bf7-91ea-63807e6a77d4	ea5525cb-f083-4dfa-a9fc-d5f9b041b1df	3b33cdbe-b9c0-48f5-ae10-70690765c792	EVT-2026-00083	confirmed	qr_public-speaking-masterclass-2026_3b33cdbe_83	2026-05-17 23:56:00.849	222.50	completed	2026-05-10 19:51:09.077
2b000498-129e-4781-820b-4a70f9aa487f	f219e7c2-726c-47c6-9f3a-3bb1c8e96aae	ea5525cb-f083-4dfa-a9fc-d5f9b041b1df	8ad4720c-9a42-400d-8c59-f297878d08c9	EVT-2026-00084	confirmed	qr_public-speaking-masterclass-2026_8ad4720c_84	2026-05-16 23:56:00.849	62.30	completed	2026-05-10 19:51:09.078
90e3a733-d94c-46fd-a950-f7ac2c7be309	f219e7c2-726c-47c6-9f3a-3bb1c8e96aae	ea5525cb-f083-4dfa-a9fc-d5f9b041b1df	462f1084-506b-41bc-8f52-48cd139111da	EVT-2026-00085	confirmed	qr_public-speaking-masterclass-2026_462f1084_85	2026-05-14 23:56:00.849	62.30	completed	2026-05-10 19:51:09.079
333be0c1-6422-4aaf-bc11-bdbca50cb9d1	1d816f58-ef30-49f6-890f-f5a24950e899	de268477-60b2-45ab-ac2f-da9a1b267613	326cab9a-52d9-47d9-b8ca-ddc0657ad122	EVT-2026-00086	confirmed	qr_homes-for-all-gala-2026_326cab9a_86	2026-05-13 23:56:00.851	500.00	completed	2026-05-10 19:51:09.079
089de805-1599-4896-afe4-1b99fa05338b	7b3853e5-2fef-4d25-b402-c5d231c192c5	2cf78b12-a368-4b7a-8d21-e426bded960f	ecf9e6ba-edc3-4194-8e8f-1166e432d4db	EVT-2026-00087	confirmed	qr_charity-dog-walk-adoption-2026_ecf9e6ba_87	2026-05-18 23:56:00.852	10.50	completed	2026-05-10 19:51:09.085
7cd46132-cd1f-4d76-ad45-787d35a537e2	7b3853e5-2fef-4d25-b402-c5d231c192c5	2cf78b12-a368-4b7a-8d21-e426bded960f	8ad4720c-9a42-400d-8c59-f297878d08c9	EVT-2026-00088	confirmed	qr_charity-dog-walk-adoption-2026_8ad4720c_88	2026-05-20 23:56:00.852	10.50	completed	2026-05-10 19:51:09.086
245b4b32-7478-4487-b5b9-9ebfb669bdf1	7b3853e5-2fef-4d25-b402-c5d231c192c5	2cf78b12-a368-4b7a-8d21-e426bded960f	3b33cdbe-b9c0-48f5-ae10-70690765c792	EVT-2026-00089	confirmed	qr_charity-dog-walk-adoption-2026_3b33cdbe_89	2026-05-18 23:56:00.852	10.50	completed	2026-05-10 19:51:09.087
5cfdf103-dcb5-42d2-8fe5-82e0728f863f	5f918aa4-20ee-46cd-a0d1-ad476bbbf05c	2cf78b12-a368-4b7a-8d21-e426bded960f	dfbf5dd5-7284-4ec6-a5af-14f3043750f3	EVT-2026-00090	confirmed	qr_charity-dog-walk-adoption-2026_dfbf5dd5_90	2026-05-20 23:56:00.852	37.50	completed	2026-05-10 19:51:09.087
a22620c9-0967-4893-a4e9-d8c83af83a9a	45d69e24-f70c-4999-aa0f-6b0cfa47836f	cb4deeee-eda0-4e25-9204-86cb0be18a4a	8ad4720c-9a42-400d-8c59-f297878d08c9	EVT-2026-00091	confirmed	qr_back-to-school-supply-drive-2026_8ad4720c_91	2026-05-16 23:56:00.852	0.00	completed	2026-05-10 19:51:09.088
382e4d7a-1163-459e-9574-495e222e016f	45d69e24-f70c-4999-aa0f-6b0cfa47836f	cb4deeee-eda0-4e25-9204-86cb0be18a4a	326cab9a-52d9-47d9-b8ca-ddc0657ad122	EVT-2026-00092	confirmed	qr_back-to-school-supply-drive-2026_326cab9a_92	2026-05-21 23:56:00.852	0.00	completed	2026-05-10 19:51:09.089
0479777e-98fb-4097-aef7-b247bdf78b6a	dde9abd1-b045-4ac1-9765-df5b4d66740e	2d41214e-687e-4af0-972d-5b1752745562	326cab9a-52d9-47d9-b8ca-ddc0657ad122	EVT-2026-00093	confirmed	qr_remote-work-webinar-2026_326cab9a_93	2026-05-16 23:56:00.853	0.00	completed	2026-05-10 19:51:09.09
12747bc1-1b70-49be-b3f9-705d6f081b65	4fbe0913-aeb6-4609-84f2-6fda9e5b0498	14402a1b-247f-4b46-a573-2169ecb7e00b	326cab9a-52d9-47d9-b8ca-ddc0657ad122	EVT-2026-00094	confirmed	qr_creative-writing-online-2026_326cab9a_94	2026-05-22 23:56:00.854	104.30	completed	2026-05-10 19:51:09.09
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (id, email, password_hash, first_name, last_name, role, avatar_url, phone, bio, is_verified, is_active, created_at, updated_at, google_calendar_refresh_token) FROM stdin;
ccfb3f1d-0ffe-4eaa-971e-66adc11df4d5	admin@eventhub.com	$2a$12$.2PLCODRAVdYPLUR2Aeecus55L2WWlyjw7YYISvb3tLTfiNNBZ86G	Admin	User	admin	\N	408-555-0100	Platform administrator for EventHub.	t	t	2026-05-09 23:55:59.415	2026-05-09 23:55:59.415	\N
ecf9e6ba-edc3-4194-8e8f-1166e432d4db	org1@eventhub.com	$2a$12$uB7tscpae6h7xkJEctHqK.4KEW/Qut3.ctEYcq6JuSKstb328Vvvy	John	Smith	organizer	\N	408-555-0201	Event organizer specializing in tech conferences and meetups in the Bay Area.	t	t	2026-05-09 23:55:59.617	2026-05-09 23:55:59.617	\N
326cab9a-52d9-47d9-b8ca-ddc0657ad122	org2@eventhub.com	$2a$12$3lilqMTRARfhGYVcyO94oOsbcO184NdDwBAiSqP4.Pg4jQ50cqgai	Jane	Doe	organizer	\N	650-555-0202	Community builder and event organizer focused on arts, food, and cultural events.	t	t	2026-05-09 23:55:59.814	2026-05-09 23:55:59.814	\N
3b33cdbe-b9c0-48f5-ae10-70690765c792	user2@eventhub.com	$2a$12$67UtTx34qEuPMAelBicjI.xzS3xtyzuuD24jeJAcXsr4Te3rl9.ze	Bob	Williams	attendee	\N	650-555-0302	Music lover and foodie always looking for the next great event.	t	t	2026-05-09 23:56:00.209	2026-05-09 23:56:00.209	\N
8ad4720c-9a42-400d-8c59-f297878d08c9	user3@eventhub.com	$2a$12$uPfJxs8Knsu.i6mlVeixBe8G6JPV.Qmg.JYYuPmBkvwgujZSYKaYG	Carlos	Garcia	attendee	\N	510-555-0303	Fitness enthusiast and community volunteer.	f	t	2026-05-09 23:56:00.407	2026-05-09 23:56:00.407	\N
f78570fc-d61a-4004-8305-47582fd8161d	user4@eventhub.com	$2a$12$dKAjdmfsFjpUysRQiq0A9ezVsbPwnauxQV2.rsSBDBDeL.Ca8Ev3.	Diana	Chen	attendee	\N	408-555-0304	Artist and designer who enjoys creative workshops and gallery openings.	t	t	2026-05-09 23:56:00.604	2026-05-09 23:56:00.604	\N
462f1084-506b-41bc-8f52-48cd139111da	user5@eventhub.com	$2a$12$0x./VTML9vRfgrmwCvFv4OcW/lj/J5TIC1XRUFlPeNzMkPdhC/GcG	Ethan	Patel	attendee	\N	650-555-0305	Startup founder interested in business networking and entrepreneurship events.	f	t	2026-05-09 23:56:00.802	2026-05-09 23:56:00.802	\N
4c7e57a7-9c3e-4b82-bf27-f81b0deaa729	gowripreetham23@gmail.com	$2a$12$06Jedjjqkjj6FVJBdaUjUObLaQ89gOukj6f3SUAbihUzaz9RMG046	Gowri Preetam	Gunisetty	attendee	\N	\N	\N	f	t	2026-05-10 18:28:49.047	2026-05-10 18:28:49.047	\N
df8555c5-e1cf-4bda-a4eb-4aba2152e276	example_email1@gmail.com	$2a$12$tIjidCtTZn2VnicNZVjvau3lA8Rhfk44vhpLuqZ.Y0vSnu3chLiW6	test_user1	user last name	attendee	\N	\N	\N	f	t	2026-05-11 00:29:43.246	2026-05-11 00:29:43.246	\N
dfbf5dd5-7284-4ec6-a5af-14f3043750f3	user1@eventhub.com	$2a$12$108obGi09dpa5h.9Ac97Wu6NW36AlmPuHdwfAwNOMooa7MnDe2/Rq	Alice	Johnson	attendee	\N	408-555-0301	Tech enthusiast who loves attending hackathons and developer meetups.	t	t	2026-05-09 23:56:00.011	2026-05-11 00:35:42.06	\N
\.


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- Name: event_updates event_updates_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.event_updates
    ADD CONSTRAINT event_updates_pkey PRIMARY KEY (id);


--
-- Name: event_views event_views_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.event_views
    ADD CONSTRAINT event_views_pkey PRIMARY KEY (id);


--
-- Name: events events_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_pkey PRIMARY KEY (id);


--
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- Name: refresh_tokens refresh_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT refresh_tokens_pkey PRIMARY KEY (id);


--
-- Name: rsvps rsvps_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rsvps
    ADD CONSTRAINT rsvps_pkey PRIMARY KEY (id);


--
-- Name: saved_events saved_events_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.saved_events
    ADD CONSTRAINT saved_events_pkey PRIMARY KEY (id);


--
-- Name: ticket_types ticket_types_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ticket_types
    ADD CONSTRAINT ticket_types_pkey PRIMARY KEY (id);


--
-- Name: tickets tickets_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tickets
    ADD CONSTRAINT tickets_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: categories_name_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX categories_name_key ON public.categories USING btree (name);


--
-- Name: categories_slug_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX categories_slug_key ON public.categories USING btree (slug);


--
-- Name: event_updates_event_id_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX event_updates_event_id_created_at_idx ON public.event_updates USING btree (event_id, created_at);


--
-- Name: events_category_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX events_category_id_idx ON public.events USING btree (category_id);


--
-- Name: events_slug_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX events_slug_key ON public.events USING btree (slug);


--
-- Name: events_start_date_end_date_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX events_start_date_end_date_idx ON public.events USING btree (start_date, end_date);


--
-- Name: events_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX events_status_idx ON public.events USING btree (status);


--
-- Name: notifications_user_id_is_read_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX notifications_user_id_is_read_idx ON public.notifications USING btree (user_id, is_read);


--
-- Name: rsvps_approval_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX rsvps_approval_status_idx ON public.rsvps USING btree (approval_status);


--
-- Name: rsvps_event_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX rsvps_event_id_idx ON public.rsvps USING btree (event_id);


--
-- Name: rsvps_event_id_user_id_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX rsvps_event_id_user_id_key ON public.rsvps USING btree (event_id, user_id);


--
-- Name: saved_events_user_id_event_id_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX saved_events_user_id_event_id_key ON public.saved_events USING btree (user_id, event_id);


--
-- Name: tickets_ticket_number_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX tickets_ticket_number_key ON public.tickets USING btree (ticket_number);


--
-- Name: tickets_user_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX tickets_user_id_idx ON public.tickets USING btree (user_id);


--
-- Name: users_email_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);


--
-- Name: event_updates event_updates_author_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.event_updates
    ADD CONSTRAINT event_updates_author_id_fkey FOREIGN KEY (author_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: event_updates event_updates_event_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.event_updates
    ADD CONSTRAINT event_updates_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: event_views event_views_event_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.event_views
    ADD CONSTRAINT event_views_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: event_views event_views_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.event_views
    ADD CONSTRAINT event_views_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: events events_approved_by_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_approved_by_id_fkey FOREIGN KEY (approved_by_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: events events_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: events events_organizer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_organizer_id_fkey FOREIGN KEY (organizer_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: notifications notifications_event_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: notifications notifications_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: refresh_tokens refresh_tokens_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT refresh_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: rsvps rsvps_event_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rsvps
    ADD CONSTRAINT rsvps_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: rsvps rsvps_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rsvps
    ADD CONSTRAINT rsvps_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: saved_events saved_events_event_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.saved_events
    ADD CONSTRAINT saved_events_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: saved_events saved_events_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.saved_events
    ADD CONSTRAINT saved_events_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ticket_types ticket_types_event_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ticket_types
    ADD CONSTRAINT ticket_types_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: tickets tickets_event_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tickets
    ADD CONSTRAINT tickets_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: tickets tickets_ticket_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tickets
    ADD CONSTRAINT tickets_ticket_type_id_fkey FOREIGN KEY (ticket_type_id) REFERENCES public.ticket_types(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: tickets tickets_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tickets
    ADD CONSTRAINT tickets_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- PostgreSQL database dump complete
--

\unrestrict Wb7E8XQ8ELIaC316f0xW8aB91PSdazWQnFr1lA5Q491wBg9gT3hoM1pEkQmy4Pq

