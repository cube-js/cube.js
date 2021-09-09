-- -------------------------------------------------------------
-- Database: ecom-local
-- Generation Time: 2021-08-30 09:28:58.6690
-- -------------------------------------------------------------

-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS suppliers_id_seq;

-- Table Definition
CREATE TABLE "public"."suppliers" (
    "id" int4 NOT NULL DEFAULT nextval('suppliers_id_seq'::regclass),
    "address" varchar(255) DEFAULT NULL::character varying,
    "email" varchar(255) DEFAULT NULL::character varying,
    "created_at" timestamp,
    "company" varchar(255),
    PRIMARY KEY ("id")
);

INSERT INTO "public"."suppliers" ("id", "address", "email", "created_at", "company") VALUES
(1, '6845 Orci Avenue', 'sit.amet@ultriciesligula.com', '2017-09-16 21:25:57', 'Ipsum Incorporated'),
(2, '3755 Tempor Rd.', 'eget@nuncullamcorper.edu', '2016-10-05 05:14:40', 'Enim Ltd'),
(3, '6841 Mauris Av.', 'Nullam.feugiat.placerat@odiosagittissemper.net', '2018-12-07 01:56:01', 'Ipsum Leo Foundation'),
(4, '6523 Cursus Rd.', 'Phasellus.at.augue@risusDuisa.co.uk', '2019-02-16 17:28:11', 'At Pede Cras Corporation'),
(5, 'P.O. Box 800, 6310 Eu Rd.', 'dolor.tempus@elit.net', '2017-01-22 12:18:11', 'Eget Volutpat Limited'),
(6, '442 Aliquam Avenue', 'gravida.sit.amet@risus.net', '2018-10-28 22:50:29', 'Ullamcorper Duis LLC'),
(7, 'P.O. Box 947, 4761 Consectetuer St.', 'sapien@lectusNullam.ca', '2018-07-20 06:07:22', 'Scelerisque Foundation'),
(8, 'P.O. Box 714, 501 Sit Avenue', 'volutpat@Quisquepurussapien.net', '2018-12-08 07:44:35', 'Elit Aliquam Auctor Incorporated'),
(9, 'Ap #630-2093 Aliquam Avenue', 'augue.Sed@ullamcorper.org', '2016-09-24 22:51:43', 'A Inc.'),
(10, 'Ap #435-9227 Nunc St.', 'Sed.nunc@Etiamgravidamolestie.co.uk', '2016-11-16 21:49:15', 'Imperdiet LLC'),
(11, 'P.O. Box 899, 6870 Sed Street', 'malesuada@id.co.uk', '2019-01-04 05:56:18', 'Urna Ut Tincidunt Inc.'),
(12, '194-271 Diam. Av.', 'dapibus.ligula@congue.com', '2017-03-16 20:50:13', 'Dolor Sit Amet Associates'),
(13, '668-9568 Velit. Rd.', 'Quisque@risusDonec.org', '2017-04-20 10:07:50', 'Non Bibendum Sed Incorporated'),
(14, 'Ap #424-2088 Suspendisse St.', 'Quisque.purus.sapien@lobortis.com', '2018-06-10 21:31:20', 'Eu Turpis Foundation'),
(15, 'P.O. Box 367, 727 Aenean Av.', 'et.ipsum.cursus@fermentumconvallis.ca', '2018-03-29 08:47:06', 'Sagittis Nullam Industries'),
(16, '129-7517 Egestas Avenue', 'elit.erat.vitae@arcu.org', '2016-10-11 16:07:35', 'Egestas A Scelerisque Ltd'),
(17, '590-7965 Nisi Street', 'est.tempor.bibendum@ridiculusmusProin.ca', '2017-02-12 15:19:52', 'Non Company'),
(18, 'P.O. Box 700, 3864 Tincidunt. Street', 'Cras@consectetuercursuset.co.uk', '2018-02-26 13:10:42', 'Quisque Purus Sapien Limited'),
(19, '768-2240 Sapien Avenue', 'Mauris@ac.com', '2018-09-03 02:54:00', 'Tortor Inc.'),
(20, 'Ap #620-3092 Malesuada St.', 'tortor.dictum.eu@Pellentesqueultricies.edu', '2018-01-26 03:14:38', 'Ut Industries'),
(21, 'P.O. Box 579, 4233 Ultricies Rd.', 'sagittis.placerat@nibhsitamet.ca', '2018-04-29 02:20:18', 'Tortor At Risus Institute'),
(22, '512-7140 Lobortis Av.', 'felis@nibhDonec.ca', '2017-01-04 02:16:59', 'In Cursus Incorporated'),
(23, 'Ap #463-812 Id, Street', 'eget.metus.eu@justoProinnon.co.uk', '2017-03-30 06:36:52', 'Ut Dolor Inc.'),
(24, 'Ap #953-7335 Porttitor Rd.', 'porttitor@mifringilla.net', '2016-12-06 17:27:06', 'Scelerisque Scelerisque Industries'),
(25, '9135 Luctus Av.', 'pulvinar@scelerisquenequesed.com', '2018-11-10 10:30:42', 'Eget Corp.'),
(26, '2805 Turpis Ave', 'at.pede@laciniaSed.org', '2018-06-18 22:48:44', 'Suspendisse Sagittis Ltd'),
(27, '2147 Et, Avenue', 'non.lacinia.at@risusDuisa.org', '2019-01-28 13:47:32', 'Adipiscing Lobortis Associates'),
(28, 'P.O. Box 546, 4193 Aliquet, Rd.', 'eu.eros@semper.net', '2018-04-02 14:55:02', 'Nibh Associates'),
(29, '4126 Donec Street', 'eget.dictum.placerat@dolor.co.uk', '2016-10-17 10:34:50', 'Ornare Ltd'),
(30, 'Ap #940-4287 Egestas. Road', 'eu@lacinia.co.uk', '2018-07-22 23:24:54', 'Posuere Ltd'),
(31, '6443 Ac Street', 'netus.et.malesuada@orcilobortisaugue.edu', '2017-01-17 01:18:17', 'Fusce Consulting'),
(32, 'P.O. Box 867, 2109 Sed Avenue', 'Aliquam@egestasrhoncusProin.net', '2017-08-30 11:39:36', 'Morbi Ltd'),
(33, '103-1537 Morbi Rd.', 'sit@suscipit.edu', '2018-08-02 13:43:25', 'Tempus Risus Foundation'),
(34, '4556 Lectus St.', 'in.faucibus.orci@adipiscing.net', '2017-06-12 19:46:46', 'Proin PC'),
(35, 'Ap #695-2694 Feugiat Av.', 'Mauris.nulla@consectetuer.co.uk', '2017-11-12 14:16:41', 'Sapien Molestie Orci Ltd'),
(36, '1066 Erat St.', 'In@Maecenaslibero.net', '2017-10-31 03:57:31', 'Convallis Inc.'),
(37, '914-7194 Nisl. Av.', 'orci.sem.eget@nasceturridiculus.co.uk', '2016-11-12 02:34:26', 'Erat Eget Associates'),
(38, 'P.O. Box 746, 1392 Et Road', 'Vivamus@lacus.net', '2017-08-05 13:32:26', 'Vitae Erat Vivamus Company'),
(39, '7028 Sed Road', 'Maecenas@lacinia.edu', '2018-06-06 16:19:49', 'Ipsum Cursus Foundation'),
(40, '501-3407 Dolor, Avenue', 'ipsum@nullavulputate.org', '2017-05-11 18:49:13', 'Ut Inc.'),
(41, '5155 Interdum. Avenue', 'magna.a@magnaet.ca', '2018-04-21 06:57:12', 'Vestibulum Mauris Magna Limited'),
(42, 'Ap #335-2051 Placerat. Ave', 'primis.in.faucibus@aodiosemper.net', '2018-12-10 08:51:15', 'Dictum Proin Corporation'),
(43, 'Ap #429-8230 Turpis. Av.', 'nec.tempus.scelerisque@Sedneque.net', '2018-01-16 14:25:59', 'Pede Malesuada Vel Limited'),
(44, 'P.O. Box 194, 6601 Elit Road', 'Lorem.ipsum.dolor@pharetrased.net', '2018-04-02 17:44:13', 'Ligula Donec Industries'),
(45, 'P.O. Box 760, 536 Donec Road', 'sapien@dolorquamelementum.com', '2018-09-20 20:12:31', 'Non Lorem Limited'),
(46, 'P.O. Box 244, 3366 Duis Avenue', 'ultrices.posuere@at.edu', '2018-04-10 05:16:08', 'Sed Company'),
(47, '778-4900 Massa. Street', 'Donec.non@velesttempor.net', '2018-02-10 04:56:53', 'Ultricies Adipiscing Enim LLC'),
(48, 'Ap #152-2565 Molestie Ave', 'ultrices.Duis@nequevenenatis.ca', '2016-09-24 04:13:57', 'Purus PC'),
(49, 'P.O. Box 634, 5998 Pellentesque Road', 'enim.Etiam.gravida@convallisantelectus.co.uk', '2017-09-09 16:01:07', 'Ante Nunc Mauris Ltd'),
(50, 'Ap #345-6621 Duis Rd.', 'vel.faucibus@DonectinciduntDonec.org', '2017-09-01 18:42:48', 'Enim Gravida Sit Inc.'),
(51, 'P.O. Box 993, 3621 Duis Avenue', 'erat@necimperdietnec.co.uk', '2016-11-14 20:49:12', 'Eu Incorporated'),
(52, '911-2412 In Av.', 'dignissim.lacus.Aliquam@at.org', '2017-08-27 07:53:14', 'Ut Dolor Dapibus Limited'),
(53, '518-1353 Duis Street', 'dapibus.gravida.Aliquam@congueturpisIn.com', '2019-02-27 17:44:55', 'Lorem Ac PC'),
(54, '219-9735 Sed St.', 'id.ante@natoque.org', '2016-10-06 00:32:08', 'Metus Sit Amet Limited'),
(55, '3963 Non St.', 'magna.Phasellus.dolor@InfaucibusMorbi.ca', '2017-03-21 19:52:11', 'Nullam Corp.'),
(56, '6082 Nec St.', 'est.congue.a@enimCurabitur.net', '2016-12-16 12:50:48', 'Luctus Aliquet Odio Corporation'),
(57, '792 Dui Street', 'Praesent.luctus.Curabitur@metusIn.edu', '2018-02-26 16:11:19', 'Donec Elementum Lorem Limited'),
(58, 'P.O. Box 325, 4872 Dui, Av.', 'rutrum@volutpat.ca', '2016-09-06 09:57:24', 'Nec Metus Facilisis LLP'),
(59, 'Ap #359-8986 Volutpat. St.', 'Morbi@sitamet.ca', '2018-11-08 01:23:53', 'Cursus Et LLC'),
(60, '6228 Nisi. Av.', 'est@facilisisfacilisismagna.net', '2017-09-29 06:24:14', 'Senectus Et Ltd'),
(61, '897-3460 Arcu. Ave', 'in.cursus@Duisdignissimtempor.co.uk', '2017-12-03 20:37:12', 'Volutpat Nulla Facilisis Company'),
(62, 'P.O. Box 619, 1926 Imperdiet, St.', 'ac.arcu.Nunc@fringillapurusmauris.com', '2016-11-28 07:22:38', 'Eu Foundation'),
(63, '904-8454 Cras Ave', 'neque.pellentesque@amifringilla.edu', '2017-10-09 16:52:37', 'Ac Mattis Industries'),
(64, '710-3507 Amet St.', 'a.malesuada@etmagnisdis.co.uk', '2017-12-05 21:51:22', 'Non Dui Nec Limited'),
(65, '884-5218 Scelerisque St.', 'magna.Cras@eratSed.edu', '2017-05-23 22:09:32', 'Nulla Dignissim Maecenas Corp.'),
(66, 'Ap #994-6283 Est Rd.', 'vitae@eutempor.org', '2017-04-23 03:17:17', 'Mattis Cras Incorporated'),
(67, 'Ap #955-3163 Egestas. St.', 'risus.a@Sedauctor.co.uk', '2017-07-24 09:20:18', 'Parturient Inc.'),
(68, '538-2024 Sodales Rd.', 'id.risus@luctuslobortisClass.net', '2017-05-16 15:41:07', 'Justo Eu Arcu Inc.'),
(69, '788-5733 Tempor Rd.', 'elementum.at.egestas@atiaculis.com', '2017-03-26 22:39:03', 'Sed Neque Sed Corporation'),
(70, '7852 Risus. Rd.', 'amet.risus.Donec@eget.com', '2018-07-24 20:20:28', 'Hendrerit Associates'),
(71, '5413 Ligula. Av.', 'Nam@Integervitae.ca', '2018-02-04 16:15:16', 'Urna Convallis Industries'),
(72, 'Ap #328-6738 Nec, Rd.', 'eu.arcu.Morbi@porttitor.net', '2017-09-09 09:36:02', 'Dapibus Quam Quis Company'),
(73, '1588 Mi Rd.', 'diam.at.pretium@purus.org', '2017-11-26 18:07:22', 'Ut Corporation'),
(74, 'Ap #776-6470 Mi Street', 'nunc.sit@pedeet.net', '2017-08-09 16:56:18', 'Amet Diam Eu Ltd'),
(75, '1483 Rhoncus. Rd.', 'sem.ut.dolor@vitaerisusDuis.co.uk', '2018-05-13 05:55:25', 'Ipsum Ac Mi Corp.'),
(76, '702-3865 Sit Avenue', 'lobortis@a.com', '2016-09-12 07:01:14', 'Consectetuer Cursus Consulting'),
(77, '225-6778 Turpis. Avenue', 'dolor.egestas@metus.org', '2018-01-03 19:49:47', 'Parturient Company'),
(78, 'Ap #877-4123 Tempus Rd.', 'purus.Duis@acurnaUt.org', '2017-03-26 07:23:23', 'Aliquam Nisl LLP'),
(79, 'P.O. Box 966, 8153 Facilisis. Rd.', 'lectus@scelerisque.com', '2019-01-24 06:46:18', 'Rutrum Urna Consulting'),
(80, 'Ap #634-6343 Consequat St.', 'orci.luctus@tortor.edu', '2017-02-27 17:24:45', 'Scelerisque Sed Institute'),
(81, '680-7980 Egestas Street', 'nibh@egestashendrerit.net', '2018-09-24 15:29:16', 'Donec Nibh Enim Associates'),
(82, '4639 Vitae Avenue', 'pharetra.nibh@in.ca', '2018-12-19 02:56:08', 'Aliquam Rutrum Lorem Incorporated'),
(83, '709-6774 Luctus Ave', 'at.pede.Cras@nec.org', '2016-11-06 20:12:35', 'Ante Ipsum Corp.'),
(84, '5568 Egestas. Av.', 'tellus@loremDonec.edu', '2017-07-17 21:53:41', 'Nulla Aliquet Proin PC'),
(85, '443-7806 Mauris Ave', 'lorem.ac.risus@placeratCras.co.uk', '2017-05-04 02:30:53', 'Arcu Sed Institute'),
(86, '581-3889 Ligula. Rd.', 'elit.Nulla.facilisi@Sedeget.co.uk', '2018-11-16 20:57:12', 'Varius Inc.'),
(87, '956-244 Magna St.', 'non.leo.Vivamus@ornarelectus.com', '2019-02-23 12:07:33', 'Vehicula Risus Nulla Inc.'),
(88, '874 Dignissim. Rd.', 'at.sem.molestie@Nunc.org', '2018-05-06 06:43:45', 'Leo Elementum Sem Corporation'),
(89, '4084 Non, Street', 'laoreet@semper.com', '2017-08-15 01:59:58', 'Egestas LLC'),
(90, 'Ap #791-1589 Eu Street', 'ut.pellentesque@fringillaornare.edu', '2017-08-28 08:07:12', 'Fames Ac Turpis PC'),
(91, 'P.O. Box 326, 5981 Imperdiet St.', 'Aliquam.auctor.velit@luctuslobortisClass.net', '2018-11-02 02:36:53', 'Ullamcorper Duis Cursus Corp.'),
(92, 'P.O. Box 894, 8799 Magna Rd.', 'nascetur@consectetueripsum.org', '2018-12-15 06:01:10', 'Class Aptent Taciti Consulting'),
(93, '5203 Laoreet Rd.', 'ante.ipsum.primis@bibendumfermentummetus.net', '2017-01-17 03:21:45', 'Cras LLC'),
(94, 'Ap #509-5272 Nonummy Avenue', 'eleifend@dolornonummyac.edu', '2017-11-26 07:05:15', 'Lobortis Mauris Suspendisse Consulting'),
(95, 'P.O. Box 688, 8892 Est Rd.', 'Mauris.magna@euenimEtiam.net', '2017-11-14 19:15:08', 'Tellus Id Consulting'),
(96, 'Ap #480-2469 Praesent St.', 'augue.eu@Curabiturconsequatlectus.co.uk', '2017-04-06 16:54:34', 'Eu Associates'),
(97, 'Ap #209-4483 Quis, Ave', 'orci.Donec.nibh@velit.org', '2016-09-29 11:12:37', 'Aliquam Inc.'),
(98, '574-2867 Non, St.', 'laoreet.ipsum@eleifendnunc.co.uk', '2017-10-12 17:42:40', 'Adipiscing Ligula Aenean Inc.'),
(99, 'Ap #537-5867 Ligula. St.', 'enim@consectetuerrhoncusNullam.org', '2019-02-27 05:52:58', 'Nullam Limited'),
(100, 'Ap #543-7572 Consectetuer Rd.', 'purus.accumsan@Proin.org', '2018-10-19 12:01:47', 'Massa Integer LLC')
