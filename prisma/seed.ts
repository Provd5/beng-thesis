import { type Prisma, PrismaClient } from "@prisma/client";

const client = new PrismaClient();

const getBooks = (): Prisma.bookCreateInput[] => [
  {
    title: "The Housemaid",
    authors: ["Freida McFadden"],
    published_date: "2022-08-23",
    description:
      "An addictive psychological thriller with a jaw-dropping twist that's burning up Instagram, Freida McFadden's The Housemaid is perfect for fans of Ruth Ware, Lisa Jewell, and Verity. \"Welcome to the family,\" Nina Winchester says as I shake her elegant, manicured hand. I smile politely, gazing around the marble hallway. Working here is my last chance to start fresh. I can pretend to be whoever I like. But I'll soon learn that the Winchesters' secrets are far more dangerous than my own... Every day I clean the Winchesters' beautiful house top to bottom. I collect their daughter from school. And I cook a delicious meal for the whole family before heading up to eat alone in my tiny room on the top floor. I try to ignore how Nina makes a mess just to watch me clean it up. How she tells strange lies about her own daughter. And how her husband Andrew seems more broken every day. But as I look into Andrew's handsome brown eyes, so full of pain, it's hard not to imagine what it would be like to live Nina's life. The walk-in closet, the fancy car, the perfect husband. I only try on one of Nina's pristine white dresses once. Just to see what it's like. But she soon finds out... and by the time I realize my attic bedroom door only locks from the outside, it's far too late. But I reassure myself: the Winchesters don't know who I really am. They don't know what I'm capable of...",
    isbn_10: "1538742578",
    isbn_13: "9781538742570",
    thumbnail_url:
      "http://books.google.com/books/content?id=dx5VzwEACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api",
  },
  {
    title: "The Ferryman",
    subtitle: "A Novel",
    authors: ["Justin Cronin"],
    publisher: "Ballantine Books",
    published_date: "2023-05-02",
    description:
      "“Next to impossible to put down . . . exciting, mysterious, and totally satisfying.”—STEPHEN KING From the New York Times bestselling author of The Passage comes a riveting standalone novel about a group of survivors on a hidden island utopia—where the truth isn't what it seems. Founded by the mysterious genius known as the Designer, the archipelago of Prospera lies hidden from the horrors of a deteriorating outside world. In this island paradise, Prospera’s lucky citizens enjoy long, fulfilling lives until the monitors embedded in their forearms, meant to measure their physical health and psychological well-being, fall below 10 percent. Then they retire themselves, embarking on a ferry ride to the island known as the Nursery, where their failing bodies are renewed, their memories are wiped clean, and they are readied to restart life afresh. Proctor Bennett, of the Department of Social Contracts, has a satisfying career as a ferryman, gently shepherding people through the retirement process—and, when necessary, enforcing it. But all is not well with Proctor. For one thing, he’s been dreaming—which is supposed to be impossible in Prospera. For another, his monitor percentage has begun to drop alarmingly fast. And then comes the day he is summoned to retire his own father, who gives him a disturbing and cryptic message before being wrestled onto the ferry. Meanwhile, something is stirring. The Support Staff, ordinary men and women who provide the labor to keep Prospera running, have begun to question their place in the social order. Unrest is building, and there are rumors spreading of a resistance group—known as “Arrivalists”—who may be fomenting revolution. Soon Proctor finds himself questioning everything he once believed, entangled with a much bigger cause than he realized—and on a desperate mission to uncover the truth.",
    isbn_10: "052561947X",
    isbn_13: "9780525619475",
    thumbnail_url:
      "http://books.google.com/books/content?id=SGGTEAAAQBAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api",
    categories: ["Fiction"],
  },
  {
    title: "It",
    subtitle: "A Novel",
    authors: ["Stephen King"],
    publisher: "Simon and Schuster",
    published_date: "2016-01-05",
    description:
      "In 1985, six men and one woman are called back together to search for a creature of unspeakable evil that had stalked them as children.",
    isbn_10: "1501142976",
    isbn_13: "9781501142970",
    page_count: 1184,
    thumbnail_url:
      "http://books.google.com/books/content?id=S85NCwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api",
    categories: ["Fiction"],
  },
  {
    title: "The Lion, the Witch and the Wardrobe Movie Tie-in Edition (rack)",
    authors: ["C. S. Lewis"],
    publisher: "HarperFestival",
    published_date: "2005-10-25",
    description:
      "They open a door and enter a world Narnia ... a land frozen in eternal winter ... a country waiting to be set free. Four adventurers step through a wardrobe door and into the land of Narnia -- a land enslaved by the power of the White Witch. But when almost all hope is lost, the return of the Great Lion, Aslan, signals a great change ... and a great sacrifice.",
    isbn_10: "0060765488",
    isbn_13: "9780060765484",
    page_count: 224,
    thumbnail_url:
      "http://books.google.com/books/content?id=9ydYuQEACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api",
    categories: ["Juvenile Fiction"],
  },
  {
    title: "The Getaway",
    authors: ["Lamar Giles"],
    published_date: "2022-09",
    description:
      "'Timely, thrilling, and gripping from start to finish. An absolute page-turner.' --KAREN M. MCMANUS, BESTSELLING AUTHOR OFONE OF US IS LYING NO ONE HAS EVER DIED IN KARLOFF COUNTY Welcome to the funnest place around . . . Jay is living his best life inside Karloff Country, home of the world's most epic amusement park. He's got his family, his crew, and a dope after-school job at one of the parks. Outside Karloff Country, things aren't so great for the rest of the world. But when people come here to vacation, it's to get away from all that to a picture-perfect place. Until suddenly everything changes. People start disappearing in the middle of the night, including Jay's friend Connie and her family. Then the richest and most powerful families start arriving at Karloff, only . . . they aren't leaving. Unknown to the employees, the famous resort has been selling shares in an end-of-the-world oasis. The best of the best at the End of Days. And in order to deliver the top-notch customer service the wealthy clientele paid for, the employees will be at their total beck and call. Whether they like it or not. Yet Karloff Country didn't count on Jay and his crew--and just how far they'll go to find out the truth and save themselves. But what's more dangerous: the monster you know in your home or the unknown nightmare outside the walls? Perfect for fans of Tiffany D. Jackson, Angie Thomas, and Stephen King A creepy thriller - the speculative genius of Jordan Peele meets masterful writing From author Lamar Giles, founding member of We Need Diverse Books",
    isbn_10: "0702323322",
    isbn_13: "9780702323324",
  },
  {
    title: "Murder on the Orient Express",
    authors: ["Agatha Christie"],
    publisher: "HarperCollins UK",
    published_date: "2001",
    description:
      "Just After Midnight, A Snowdrift Stopped The Orient Express In Its Tracks. The Luxurious Train Was Surprisingly Full For The Time Of The Year. But By The Morning There Was One Passenger Fewer. An American Lay Dead In His Compartment, Stabbed A Dozen Times, His Door Locked From The Inside. With Tension Mounting, Detective Hercule Poirot Comes Up With Not One, But Two Solutions To The Crime.",
    isbn_10: "0007119313",
    isbn_13: "9780007119318",
    page_count: 15,
    thumbnail_url:
      "http://books.google.com/books/content?id=HUke5qYod9EC&printsec=frontcover&img=1&zoom=1&source=gbs_api",
    categories: ["Fiction"],
  },
  {
    title: "A Study in Scarlet",
    authors: ["Sir Arthur Conan Doyle"],
    publisher: "National Geographic Books",
    published_date: "2011-09-27",
    description:
      "'There's a scarlet thread of murder running through the colourless skein of life, and our duty is to unravel it, and isolate it, and expose every inch of it.' From the moment Dr John Watson takes lodgings in Baker Street with the consulting detective Sherlock Holmes, he becomes intimately acquainted with the bloody violence and frightening ingenuity of the criminal mind. In A Study in Scarlet , Holmes and Watson's first mystery, the pair are summoned to a south London house where they find a dead man whose contorted face is a twisted mask of horror. The body is unmarked by violence but on the wall a mysterious word has been written in blood. The police are baffled by the crime and its circumstances. But when Sherlock Holmes applies his brilliantly logical mind to the problem he uncovers a tragic tale of love and deadly revenge . . .",
    isbn_10: "0241952891",
    isbn_13: "9780241952894",
    thumbnail_url:
      "http://books.google.com/books/content?id=BsmMEAAAQBAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api",
    categories: ["Fiction"],
  },
  {
    title: "Animal Farm",
    subtitle: "75th Anniversary Edition",
    authors: ["George Orwell"],
    publisher: "National Geographic Books",
    published_date: "2004-04-06",
    description:
      "75th Anniversary Edition—Includes a New Introduction by Téa Obreht George Orwell's timeless and timely allegorical novel—a scathing satire on a downtrodden society’s blind march towards totalitarianism. “All animals are equal, but some animals are more equal than others.” A farm is taken over by its overworked, mistreated animals. With flaming idealism and stirring slogans, they set out to create a paradise of progress, justice, and equality. Thus the stage is set for one of the most telling satiric fables ever penned—a razor-edged fairy tale for grown-ups that records the evolution from revolution against tyranny to a totalitarianism just as terrible. When Animal Farm was first published, Stalinist Russia was seen as its target. Today it is devastatingly clear that wherever and whenever freedom is attacked, under whatever banner, the cutting clarity and savage comedy of George Orwell’s masterpiece have a meaning and message still ferociously fresh.",
    isbn_10: "0451526341",
    isbn_13: "9780451526342",
    thumbnail_url:
      "http://books.google.com/books/content?id=Q8eNEAAAQBAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api",
    categories: ["Fiction"],
  },
  {
    title: "The Two Towers",
    subtitle: "Being the Second Part of The Lord of the Rings",
    authors: ["John Ronald Reuel Tolkien"],
    publisher: "HarperCollins UK",
    published_date: "2007",
    description:
      "The second volume in The Lord of the Rings; This title is also available as a film.",
    isbn_10: "0261102362",
    isbn_13: "9780261102361",
    page_count: 461,
    thumbnail_url:
      "http://books.google.com/books/content?id=ebyPyQWmUA8C&printsec=frontcover&img=1&zoom=1&source=gbs_api",
    categories: ["Fiction"],
  },
  {
    title: "Things We Never Got Over",
    authors: ["Lucy Score"],
    publisher: "Bloom Books",
    published_date: "2022-01-12",
    description:
      "Bearded, bad-boy barber Knox prefers to live his life the way he takes his coffee: Alone. Unless you count his basset hound, Waylon. Knox doesn't tolerate drama, even when it comes in the form of a stranded runaway bride. Naomi wasn't just running away from her wedding. She was riding to the rescue of her estranged twin to Knockemout, Virginia, a rough-around-the-edges town where disputes are settled the old-fashioned way...with fists and beer. Usually in that order. Too bad for Naomi her evil twin hasn't changed at all. After helping herself to Naomi's car and cash, Tina leaves her with something unexpected. The niece Naomi didn't know she had. Now she's stuck in town with no car, no job, no plan, and no home with an 11-year-old going on thirty to take care of. There's a reason Knox doesn't do complications or high-maintenance women, especially not the romantic ones. But since Naomi's life imploded right in front of him, the least he can do is help her out of her jam. And just as soon as she stops getting into new trouble he can leave her alone and get back to his peaceful, solitary life. At least, that's the plan until the trouble turns to real danger.",
    isbn_10: "194563183X",
    isbn_13: "9781945631832",
    thumbnail_url:
      "http://books.google.com/books/content?id=LbG_zgEACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api",
    categories: ["Fiction"],
  },
  {
    title: "Shatter Me",
    authors: ["Tahereh Mafi"],
    publisher: "HarperCollins",
    published_date: "2012-10-02",
    description:
      "I have a curse. I have a gift. I'm a monster. I'm more than human. My touch is lethal. My touch is power. I am their weapon. I will fight back. No one knows why Juliette's touch is fatal, but The Reestablishment has plans for her. Plans to use her as a weapon. But Juliette has plans of her own. After a lifetime without freedom, she's finally discovering a strength to fight back for the very first time—and to find a future with the one boy she thought she'd lost forever. In this electrifying debut, Tahereh Mafi presents a riveting dystopian world, a thrilling superhero story, and an unforgettable heroine.",
    isbn_10: "0062085506",
    isbn_13: "9780062085504",
    page_count: 368,
    thumbnail_url:
      "http://books.google.com/books/content?id=giXxsgEACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api",
    categories: ["Juvenile Fiction"],
  },
  {
    title: "Później",
    authors: ["Stephen King"],
    published_date: "2021",
    description:
      "Sometimes growing up means facing your demons. The son of a struggling single mother, Jamie Conklin just wants an ordinary childhood. But Jamie is no ordinary child. Born with an unnatural ability his mom urges him to keep secret, Jamie can see what no one else can see and learn what no one else can learn. But the cost of using this ability is higher than Jamie can imagine - as he discovers when an NYPD detective draws him into the pursuit of a killer who has threatened to strike from beyond the grave. LATER is Stephen King at his finest, a terrifying and touching story of innocence lost and the trials that test our sense of right and wrong. With echoes of King's classic novel It, LATER is a powerful, haunting, unforgettable exploration of what it takes to stand up to evil in all the faces it wears.",
    isbn_10: "8382153615",
    isbn_13: "9788382153613",
    page_count: 382,
    categories: ["Bombings"],
  },
  {
    title: "Wiedzmin 3 Krew elfow",
    authors: ["Andrzej Sapkowski"],
    published_date: "2014-01",
    isbn_10: "8375780650",
    isbn_13: "9788375780659",
    page_count: 340,
  },
  {
    title: "Droga Szamana",
    subtitle: "Na tropie stwórcy. Etap 7",
    authors: ["Vasilij Mihajlovič Mahanenko"],
    published_date: "2022",
    isbn_10: "8366873560",
    isbn_13: "9788366873568",
  },
  {
    title: "Mitologia nordycka",
    authors: ["Neil Gaiman"],
    published_date: "2017",
    description:
      'Wielkie nordyckie mity to jeden z korzeni, z których wyrasta nasza tradycja literacka - od Tolkiena, Alana Garnera i Rosemary Sutcliff po "Grę o tron" i komiksy Marvela. Stały się też inspiracją dla wielu obsypanych nagrodami bestsellerów Neila Gaimana. Teraz sam Gaiman sięga w odległą przeszłość, do oryginalnych źródeł tych opowieści, by przedstawić nam nowe, barwne i porywające wersje największych nordyckich historii. Dzięki niemu bogowie ożywają - pełni namiętności, złośliwi, wybuchowi, okrutni - a opowieść przenosi nas do ich świata - od zarania wszechrzeczy, aż po Ragnarok i zmierzch bogów. Barwne przygody Thora, Lokiego, Odyna czy Frei fascynują współczesnego czytelnika, a żywy, błyskotliwy język sprawia, że aż proszą się o to, by czytać je na głos przy ognisku w mroźną gwiaździstą noc.',
    isbn_10: "8374807288",
    isbn_13: "9788374807289",
    page_count: 228,
    categories: ["Fiction"],
  },
  {
    title: "Halny",
    authors: ["Remigiusz Mróz"],
    published_date: "2021",
    description:
      '"Góry nie zaznały krwi przez niemal trzy lata. Panujący w nich spokój trwał, od kiedy Wiktor Forst ujął mordercę nazywanego Bestią z Giewontu - i nic nie wskazywało na to, by sytuacja miała się zmienić. Koszmar nadszedł wraz z halnym. Dominika Wadryś-Hansen została wezwana do Zakopanego, gdy tuż przed wejściem do kaplicy na Wiktorówkach odnaleziono makabrycznie zamordowaną kobietę. Ciało rozcięto, wnętrzności wywleczono, a w ustach ofiary umieszczono monetę łudząco przypominającą te, którymi posługiwał się seryjny zabójca lata temu. Poszlaki prowadzą donikąd, odpowiedzi jednak zdaje się mieć osadzony w więzieniu Iwo Eliasz. Deklaruje, że zamierza się nimi podzielić - ale tylko z jednym człowiekiem. Człowiekiem, który zniknął."--Page 4 of cover.',
    isbn_10: "8381957575",
    isbn_13: "9788381957571",
    page_count: 479,
    categories: ["Murder"],
  },
  {
    title: "Florystka",
    authors: ["Katarzyna Bonda"],
    published_date: "2022",
    isbn_10: "8328726203",
    isbn_13: "9788328726208",
  },
  {
    title: "Pacjentka",
    authors: ["Alex Michaelides"],
    published_date: "2019",
    description:
      "\"Alicia Berenson's life is seemingly perfect. A famous painter married to an in-demand fashion photographer, she lives in a grand house overlooking a park in one of London's most desirable areas. One evening, her husband, Gabriel, returns home late from work, and Alicia shoots him five times in the face and then never speaks another word. Alicia's refusal to talk, or give any kind of explanation, turns a domestic tragedy into something far grander, a mystery that captures the public imagination and casts Alicia into notoriety. The price of her art skyrockets, and she, the silent patient, is hidden away from the tabloids and spotlight at the Grove, a secure psychiatric unit in North London. Criminal psychotherapist Theo Faber is captivated by Alicia's story and jumps at the opportunity to work with her. His determination to get her to talk and unravel the mystery of why she shot her husband takes him down a path more unexpected, more terrifying than he ever imagined -- a search for the truth that threatens to consume him\" -- Celadon Books.",
    isbn_10: "8328061473",
    isbn_13: "9788328061477",
    page_count: 349,
    categories: ["Celebrities"],
  },
  {
    title: "Mały Książę",
    authors: ["Antoine de Saint-Exupéry"],
    published_date: "2009",
    description:
      "An aviator whose plane is forced down in the Sahara Desert encounters a little prince from a small planet who relates his adventures in seeking the secret of what is important in life.",
    isbn_10: "8374954000",
    isbn_13: "9788374954006",
    page_count: 93,
    categories: ["Allegories"],
  },
  {
    title: "Czarownica",
    authors: ["Camilla Läckberg"],
    published_date: "2017",
    description:
      "The disappearance of the four year old Linnai from the farm near Fjällbacki resembles a tragic event from thirty years ago. From the same place a smll girl died, whose body was soon found in a nearby lake. Two thirteen year olds confessed to the murder, then they canceled it, but th court found them guilty, although they were not put in prison as juveniles. One of them then lived quietly in Fjällbacki. The second came back years later as the famous Hollywood actress to play in the movie there, about the actress Ingrid Berman, who often spent holidays in the area. Patrik Hedström and his colleagues from the Tanumshede plice station are starting to look for a relationship between both cases, although initially they do not believe in him. Erika Falck, who works on a book about crimes from years ago, helps him.",
    isbn_10: "8380158172",
    isbn_13: "9788380158177",
    page_count: 592,
    categories: ["Fiction"],
  },
  {
    title: "Kolejne 365 dni",
    authors: ["Blanka Lipińska"],
    published_date: "2019",
    isbn_10: "8326828424",
    isbn_13: "9788326828423",
  },
  {
    title: "Zmierzch",
    authors: ["Stephenie Meyer"],
    published_date: "2009",
    description:
      "When seventeen year old Bella leaves Phoenix to live with her father in Forks, Washington, she meets an exquisitely handsome boy at school for whom she feels an overwhelming attraction and who she comes to realize is not wholly human.",
    isbn_10: "832458823X",
    isbn_13: "9788324588237",
    page_count: 413,
    categories: ["Cullen, Edward (Fictitious character)"],
  },
];

const main = async () => {
  await Promise.all(
    getBooks().map((book) => client.book.create({ data: book }))
  );
};

main()
  .then(async () => {
    await client.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await client.$disconnect();
    process.exit(1);
  });
