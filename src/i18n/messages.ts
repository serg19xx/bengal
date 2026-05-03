import { type Locale, isLocale } from "./config";

export const messagesEn = {
  meta: {
    siteName: "Willow Home Cattery",
    defaultDescription:
      "A small home cattery focused on health, temperament, and thoughtful placements — English and French.",
  },
  brand: { line1: "Willow Home", line2: "Cattery" },
  nav: {
    home: "Home",
    about: "About",
    cats: "Cats",
    available: "Available",
    gallery: "Gallery",
    contact: "Contact",
    adoption: "Adoption",
    varieties: "Looks we love",
  },
  header: { menu: "Menu", mainNav: "Main", langToEn: "English", langToFr: "Français" },
  footer: {
    blurb:
      "Small home breeding with a focus on temperament, socialization, and lifelong support for our cats and their families.",
    socialLabel: "Social (placeholders)",
    instagram: "Instagram",
    facebook: "Facebook",
    legal: "Content and images are placeholders.",
  },
  hero: {
    eyebrow: "Home cattery",
    primary: "View cats",
    secondary: "Contact us",
  },
  announcement: {
    text: "We may have kittens soon — join the waitlist and tell us about your home.",
    cta: "Adoption process",
  },
  home: {
    title: "Home",
    heroTitle: "Cats raised like family",
    heroSubtitle:
      "We are a small home cattery prioritizing calm temperaments, early socialization, and transparent communication. Meet the cats who share our daily rhythms.",
    heroImageAlt: "Warm placeholder image representing a relaxed cat at home",
    welcomeEyebrow: "Welcome",
    welcomeTitle: "A quiet corner of the world for thoughtful breeding",
    welcomeSubtitle:
      "Our cats live alongside us — not in rows of cages. That shapes who they become: steady, curious, and ready for gentle, loving homes.",
    welcomeP1:
      "Willow Home is intentionally small. We keep numbers manageable so every cat receives individual attention, structured play, and exposure to everyday household life at a comfortable pace.",
    welcomeP2:
      "When you reach out, you are speaking directly with the people who feed, groom, and sleep near these cats. No call centers, no pressure — just honest answers and a careful matching process.",
    featuredEyebrow: "Featured",
    featuredTitle: "Cats you may meet first",
    featuredSubtitle:
      "A few of the personalities currently part of our home program. Availability changes — always confirm on the Available page or by message.",
    healthEyebrow: "Peace of mind",
    healthTitle: "Excellent health is the baseline",
    healthSubtitle:
      "Inspired by transparent cattery practices: clear testing history, documented care, and honest conversations before placement.",
    healthLi1:
      "Our breeding cats receive routine veterinary care; relevant health screening is summarized for families (placeholder text — replace with your protocol).",
    healthLi2:
      "Kittens leave with a care plan, records, and a written health guarantee template you can customize with your veterinarian.",
    philosophyEyebrow: "Philosophy",
    philosophyTitle: "Home breeding, defined plainly",
    philosophySubtitle:
      "We believe ethical breeding is slow, transparent, and rooted in the wellbeing of both cats and humans.",
    card1Title: "Health first",
    card1Body:
      "Veterinary relationships, documented care, and conservative decisions — especially around placement timing.",
    card2Title: "Temperament matters",
    card2Body:
      "We select for resilient, affectionate personalities suited to indoor family life — not just appearance.",
    card3Title: "Lifetime support",
    card3Body: "Questions after adoption are normal. We want you to feel comfortable reaching out as your cat settles in.",
    pawTeaserTitle: "How we match families",
    pawTeaserBody:
      "See our step-by-step adoption flow and the coat patterns we currently focus on in our small program.",
    pawTeaserAdoption: "How to adopt",
    pawTeaserVarieties: "Looks we love",
    ctaTitle: "Ready to meet our cats?",
    ctaPrimary: "View cats",
    ctaSecondary: "Contact us",
  },
  about: {
    title: "About",
    pageTitle: "Our home, their first world",
    pageKicker: "About us",
    lead:
      "Willow Home began as a simple promise: if we bring kittens into the world, they should know softness, safety, and patience from day one.",
    storyTitle: "The story",
    storySubtitle: "Placeholder narrative — replace with your real journey, mentors, and milestones.",
    storyP1:
      "We started with one cherished queen and a lot of questions. Over time, mentors, veterinarians, and fellow preservation breeders helped us shape a program that feels right for our household and our values.",
    storyP2:
      "Today, Willow Home remains intentionally small. Growth is measured in relationships, not volume — with the cats always leading the decision.",
    liveTitle: "How our cats live",
    liveSubtitle:
      "Our cats share spaces designed for observation, play, and retreat — never isolated in darkness or constant noise.",
    liveCard1Title: "Daily rhythms",
    liveCard1Body:
      "Feeding, cleaning, and quiet hours follow a predictable schedule. Cats thrive when the world feels steady.",
    liveCard2Title: "Enrichment",
    liveCard2Body:
      "Scratching posts, window perches, tunnels, and supervised exploration keep minds engaged without overwhelm.",
    careTitle: "Care, socialization, and health",
    careSubtitle: "Placeholder details — swap in your protocols, vet clinic name, and testing approach.",
    careP1:
      "Kittens meet gentle handling early, then expand to new sounds, surfaces, and visitors at a pace suited to each litter. We document weights, milestones, and concerns — nothing fancy, just careful notes.",
    careP2:
      "Adults receive routine wellness care, dental attention as needed, and nutrition tailored to life stage. We partner with a veterinary clinic we trust and follow their guidance closely.",
    principlesTitle: "Responsible breeding principles",
    principlesSubtitle: "A short manifesto you can edit to match your program and regional requirements.",
    principlesLi1: "We place cats only when they are emotionally and physically ready — never rushed for convenience.",
    principlesLi2: "We screen families with respectful questions; compatibility matters more than speed.",
    principlesLi3: "We keep records, honor contracts, and support transitions with patience and clarity.",
    principlesLi4: "We say no when something does not feel right — for the cat or for the human side.",
  },
  catsPage: {
    title: "Cats",
    eyebrow: "Our cats",
    heading: "Personalities first",
    subtitle:
      "Browse profiles and filter by breed, gender, or status. Photos and text are placeholders — replace with your real cats when ready.",
  },
  catDetail: {
    gallerySr: "Photo gallery",
    personality: "Personality",
    health: "Health & records",
    parents: "Parents",
    vetCare: "Veterinary notes",
    contactCta: "Contact about",
    metaFallback: "Cat profile",
  },
  kittensPage: {
    title: "Available",
    eyebrow: "Availability",
    heading: "Available cats & kittens",
    subtitle:
      "This list is informational and can change quickly when families are matched. Please message us for the most current status.",
    note: "Availability changes with reservations, vet timing, and the needs of each cat. If you fall in love with a profile, reach out — we will tell you honestly what is possible.",
    empty: "There are no cats marked as available in the demo dataset right now.",
    ctaTitle: "Ask about timing",
    ctaDescription:
      "Tell us about your household rhythm, experience, and what you hope for in a companion. We read every message.",
    ctaPrimary: "Contact",
    ctaSecondary: "Browse all cats",
  },
  galleryPage: {
    title: "Gallery",
    eyebrow: "Moments",
    heading: "Gallery",
    subtitle: "Tap any image to open a larger preview. Replace these placeholders with your own photography when ready.",
  },
  contactPage: {
    title: "Contact",
    heading: "Say hello",
    subtitle:
      "Please tell us which cat you are interested in. We will respond as soon as we can — the form opens your own email app with a draft (mailto), no third-party services.",
    emailLabel: "Email (placeholder)",
    emailValue: "hello@willowhome.example",
    phoneLabel: "Phone (placeholder)",
    phoneValue: "+1 (000) 000-0000",
    locationLabel: "Location (placeholder)",
    locationValue: "Quiet residential area — visits by appointment only.",
    socialLabel: "Social (placeholder)",
  },
  adoptionPage: {
    title: "Adoption",
    kicker: "Process",
    heading: "How to adopt",
    lead:
      "A simple, human-paced flow — similar to what many reputable home catteries publish: application first, then waitlist, reservation, and finally welcome home.",
    step1Title: "Fill out an application",
    step1Body:
      "Tell us about your household, schedule, experience with cats, and what you are hoping for. There are no trick questions — just clarity.",
    step2Title: "Join the waitlist",
    step2Body:
      "If we believe there may be a good match, we will explain timing honestly. A waitlist is not a guarantee; it is a respectful queue.",
    step3Title: "Reserve your kitten or cat",
    step3Body:
      "When a cat is available and the match feels right, we outline next steps, contract basics, and pickup or handoff details.",
    step4Title: "Welcome home",
    step4Body:
      "Settling-in questions are normal. We provide a starter guide and remain available for guidance during the first weeks.",
    noteTitle: "Registration (placeholder)",
    noteBody:
      "Many catteries mention association memberships (for example TICA). Replace this line with your real registry details and philosophy.",
  },
  varietiesPage: {
    title: "Looks we love",
    kicker: "Patterns & colors",
    heading: "Looking for a particular look?",
    lead:
      "We do not breed Bengals like Pawtopia — but we love this layout idea: showcase what your program focuses on so families can dream responsibly.",
    waitlist:
      "If you are waiting for a specific pattern or color, tell us in your application. Nature has the final word — we never promise exact markings.",
    card1Title: "Classic tabby warmth",
    card1Body: "Rich contrast, readable stripes, and a cozy \"fireside\" personality in many of our lines.",
    card2Title: "Soft solid coats",
    card2Body: "Even color, plush texture, and a calm presence — great for minimalists who still want a teddy bear.",
    card3Title: "Gentle bicolor accents",
    card3Body: "Quiet symmetry and sweet expressions — often paired with chatty, companion-forward temperaments.",
  },
  catCard: {
    age: "Age",
    birthDate: "Birth date",
    gender: "Gender",
    viewProfile: "View profile",
  },
  status: {
    Available: "Available",
    Reserved: "Reserved",
    Sold: "Sold",
    "Not for sale": "Not for sale",
  },
  gender: {
    Male: "Male",
    Female: "Female",
  },
  filters: {
    aria: "Filter cats",
    breed: "Breed",
    gender: "Gender",
    status: "Status",
    allBreeds: "All breeds",
    allGenders: "All",
    allStatuses: "All statuses",
    male: "Male",
    female: "Female",
    available: "Available",
    reserved: "Reserved",
    sold: "Sold",
    notForSale: "Not for sale",
    countOne: "1 cat",
    countMany: "{n} cats",
    emptyTitle: "No cats match these filters.",
    emptyHint: "Try widening your selection.",
  },
  lightbox: {
    galleryAria: "Image thumbnails",
    openSr: "Open larger view",
    close: "Close",
    prev: "Previous",
    next: "Next",
    dialogImage: "Image preview",
  },
  form: {
    intro:
      "Please tell us which cat you are interested in. After you submit, your device opens your email app with a ready-to-send message.",
    name: "Name",
    email: "Email",
    phone: "Phone",
    cat: "Cat of interest",
    notSure: "Not sure yet",
    message: "Message",
    submit: "Open in email app",
    errName: "Please enter your name.",
    errEmail: "Please enter a valid email.",
    errMessage: "Please enter a message.",
    errMailto:
      "The site is not configured with a valid contact address. Set PUBLIC_CONTACT_EMAIL for production builds.",
    mailSubjectPrefix: "Willow Home inquiry:",
    mailBodyLabelName: "Name",
    mailBodyLabelReplyEmail: "Reply-to",
    mailBodyLabelPhone: "Phone",
    mailBodyLabelCat: "Cat of interest",
    mailBodyLabelMessage: "Message",
    mailHint:
      "Uses a mailto link — your own mail app, no external form APIs. Very long messages may be truncated by some browsers.",
  },
} as const;

export type Messages = typeof messagesEn;

export const messagesFr: Messages = {
  meta: {
    siteName: "Willow Home Cattery",
    defaultDescription:
      "Un petit chatterie familial axé sur la santé, le tempérament et des placements réfléchis — en anglais et en français.",
  },
  brand: { line1: "Willow Home", line2: "Chatterie" },
  nav: {
    home: "Accueil",
    about: "À propos",
    cats: "Chats",
    available: "Disponibles",
    gallery: "Galerie",
    contact: "Contact",
    adoption: "Adoption",
    varieties: "Looks préférés",
  },
  header: { menu: "Menu", mainNav: "Principal", langToEn: "English", langToFr: "Français" },
  footer: {
    blurb:
      "Élevage familial réduit, axé sur le tempérament, la socialisation et un accompagnement durable pour nos chats et leurs familles.",
    socialLabel: "Réseaux (exemples)",
    instagram: "Instagram",
    facebook: "Facebook",
    legal: "Contenu et images d'exemple.",
  },
  hero: {
    eyebrow: "Chatterie familiale",
    primary: "Voir les chats",
    secondary: "Nous contacter",
  },
  announcement: {
    text: "Des chatons pourraient arriver bientôt — inscrivez-vous sur la liste d'attente et parlez-nous de votre foyer.",
    cta: "Processus d'adoption",
  },
  home: {
    title: "Accueil",
    heroTitle: "Des chats élevés comme en famille",
    heroSubtitle:
      "Nous sommes une petite chatterie familiale qui privilégie des tempéraments calmes, une socialisation précoce et une communication transparente. Découvrez les chats qui partagent notre quotidien.",
    heroImageAlt: "Image d'exemple évoquant un chat détendu à la maison",
    welcomeEyebrow: "Bienvenue",
    welcomeTitle: "Un coin doux du monde pour un élevage réfléchi",
    welcomeSubtitle:
      "Nos chats vivent avec nous — pas alignés dans des cages. Cela façonne leur caractère : posés, curieux et prêts pour des foyers aimants et respectueux.",
    welcomeP1:
      "Willow Home reste volontairement petite. Nous limitons les effectifs pour que chaque chat bénéficie d'une attention individuelle, de jeux structurés et d'une exposition progressive à la vie de la maison.",
    welcomeP2:
      "Quand vous nous écrivez, vous parlez directement aux personnes qui nourrissent, brossent et veillent près de ces chats. Pas de centre d'appels, pas de pression — seulement des réponses honnêtes et un processus de mise en relation soigneux.",
    featuredEyebrow: "À l'honneur",
    featuredTitle: "Les chats que vous croiserez peut-être en premier",
    featuredSubtitle:
      "Quelques personnalités du programme à la maison. La disponibilité change — vérifiez la page Disponibles ou écrivez-nous.",
    healthEyebrow: "Sérénité",
    healthTitle: "Une excellente santé comme point de départ",
    healthSubtitle:
      "Inspiré des bonnes pratiques transparentes : antécédents clairs, soins documentés et dialogues honnêtes avant placement.",
    healthLi1:
      "Nos reproducteurs bénéficient de soins vétérinaires réguliers; les dépistages pertinents sont résumés pour les familles (texte d'exemple — à remplacer par votre protocole).",
    healthLi2:
      "Les chattons repartent avec un plan de soins, des documents et un modèle de garantie santé à personnaliser avec votre vétérinaire.",
    philosophyEyebrow: "Philosophie",
    philosophyTitle: "L'élevage familial, dit simplement",
    philosophySubtitle:
      "Nous croyons qu'un élevage éthique est lent, transparent et ancré dans le bien-être des chats comme des humains.",
    card1Title: "La santé d'abord",
    card1Body:
      "Un suivi vétérinaire solide, des dossiers clairs et des décisions prudentes — surtout sur le calendrier des départs.",
    card2Title: "Le tempérament compte",
    card2Body:
      "Nous sélectionnons des personnalités résilientes et affectueuses, adaptées à la vie d'intérieur — pas seulement le regard.",
    card3Title: "Accompagnement durable",
    card3Body:
      "Des questions après l'adoption, c'est normal. Nous voulons que vous vous sentiez à l'aise pour écrire pendant l'installation.",
    pawTeaserTitle: "Comment nous jumelons les familles",
    pawTeaserBody:
      "Découvrez notre adoption étape par étape et les motifs de robe sur lesquels se concentre notre petit programme.",
    pawTeaserAdoption: "Comment adopter",
    pawTeaserVarieties: "Looks préférés",
    ctaTitle: "Prêt·e à rencontrer nos chats ?",
    ctaPrimary: "Voir les chats",
    ctaSecondary: "Nous contacter",
  },
  about: {
    title: "À propos",
    pageTitle: "Notre maison, leur premier monde",
    pageKicker: "À propos",
    lead:
      "Willow Home est né d'une promesse simple : si nous faisons naître des chatons, ils doivent connaître douceur, sécurité et patience dès le premier jour.",
    storyTitle: "Notre histoire",
    storySubtitle: "Texte d'exemple — remplacez par votre parcours, mentors et étapes marquantes.",
    storyP1:
      "Nous avons commencé avec une reine adorée et beaucoup de questions. Avec le temps, mentors, vétérinaires et collègues nous ont aidés à bâtir un programme aligné sur nos valeurs.",
    storyP2:
      "Aujourd'hui, Willow Home reste volontairement petite. La croissance se mesure en confiance, pas en volume — toujours guidée par les chats.",
    liveTitle: "Comment vivent nos chats",
    liveSubtitle:
      "Des espaces pensés pour observer, jouer et se retirer — jamais isolés dans le noir ni soumis à un bruit constant.",
    liveCard1Title: "Rythmes du quotidien",
    liveCard1Body:
      "Repas, ménage et temps calmes suivent un cadre prévisible. Les chats s'épanouissent quand le monde semble stable.",
    liveCard2Title: "Enrichissement",
    liveCard2Body:
      "Griffoirs, perchoirs, tunnels et exploration supervisée stimulent l'esprit sans surcharge.",
    careTitle: "Soins, socialisation et santé",
    careSubtitle: "Texte d'exemple — ajoutez vos protocoles, le nom de la clinique et votre approche de dépistage.",
    careP1:
      "Les chatons découvrent une manipulation douce, puis de nouveaux sons, sols et visiteurs au rythme de chaque portée. Nous notons poids, étapes et questions — simplement, avec soin.",
    careP2:
      "Les adultes reçoivent des bilans réguliers, des soins dentaires si besoin et une nutrition adaptée. Nous suivons les recommandations d'une clinique de confiance.",
    principlesTitle: "Principes d'élevage responsable",
    principlesSubtitle: "Un court manifeste à adapter à votre programme et aux exigences locales.",
    principlesLi1:
      "Nous plaçons les chats seulement quand ils sont prêts émotionnellement et physiquement — jamais sous la pression du calendrier.",
    principlesLi2:
      "Nous posons des questions respectueuses aux familles; la compatibilité prime sur la vitesse.",
    principlesLi3:
      "Nous tenons des dossiers, respectons les contrats et accompagnons les transitions avec patience et clarté.",
    principlesLi4:
      "Nous disons non lorsque quelque chose ne convient ni au chat ni aux humains.",
  },
  catsPage: {
    title: "Chats",
    eyebrow: "Nos chats",
    heading: "Les personnalités d'abord",
    subtitle:
      "Parcourez les profils et filtrez par race, sexe ou statut. Photos et textes sont des exemples — remplacez-les par vos données.",
  },
  catDetail: {
    gallerySr: "Galerie photos",
    personality: "Personnalité",
    health: "Santé et dossiers",
    parents: "Parents",
    vetCare: "Notes vétérinaires",
    contactCta: "Contacter au sujet de",
    metaFallback: "Profil du chat",
  },
  kittensPage: {
    title: "Disponibles",
    eyebrow: "Disponibilité",
    heading: "Chats et chattons disponibles",
    subtitle:
      "Cette liste est informative et peut changer rapidement lorsque des familles sont jumelées. Écrivez-nous pour le statut le plus récent.",
    note:
      "La disponibilité évolue avec les réservations, le calendrier vétérinaire et les besoins de chaque chat. Si un profil vous touche, contactez-nous — nous répondrons honnêtement.",
    empty: "Aucun chat n'est marqué disponible dans les données de démonstration pour le moment.",
    ctaTitle: "Parlons du calendrier",
    ctaDescription:
      "Parlez-nous de votre rythme de vie, de votre expérience et de ce que vous recherchez comme compagnon. Nous lisons chaque message.",
    ctaPrimary: "Contact",
    ctaSecondary: "Voir tous les chats",
  },
  galleryPage: {
    title: "Galerie",
    eyebrow: "Instants",
    heading: "Galerie",
    subtitle:
      "Touchez une image pour l'agrandir. Remplacez ces exemples par vos propres photos lorsque vous êtes prêt·e.",
  },
  contactPage: {
    title: "Contact",
    heading: "Bonjour",
    subtitle:
      "Dites-nous de quel chat vous vous approchez. Nous répondrons dès que possible — le formulaire ouvre votre courriel avec un brouillon (mailto), sans services tiers.",
    emailLabel: "Courriel (exemple)",
    emailValue: "hello@willowhome.example",
    phoneLabel: "Téléphone (exemple)",
    phoneValue: "+1 (000) 000-0000",
    locationLabel: "Lieu (exemple)",
    locationValue: "Quartier résidentiel calme — visites sur rendez-vous seulement.",
    socialLabel: "Réseaux (exemple)",
  },
  adoptionPage: {
    title: "Adoption",
    kicker: "Processus",
    heading: "Comment adopter",
    lead:
      "Un flux simple et humain — comme beaucoup de chatteries familiales sérieuses : candidature, liste d'attente, réservation puis bienvenue à la maison.",
    step1Title: "Remplir une candidature",
    step1Body:
      "Parlez-nous de votre foyer, horaires, expérience avec les chats et vos attentes. Pas de pièges — seulement de la clarté.",
    step2Title: "Rejoindre la liste d'attente",
    step2Body:
      "Si une mise en relation semble possible, nous expliquons le calendrier honnêtement. Une liste d'attente n'est pas une promesse — c'est une file respectueuse.",
    step3Title: "Réserver votre chaton ou chat",
    step3Body:
      "Quand un chat est disponible et que le jumelage semble juste, nous détaillons les prochaines étapes, le contrat et la remise.",
    step4Title: "Bienvenue à la maison",
    step4Body:
      "Des questions pendant l'installation sont normales. Nous fournissons un guide de démarrage et restons disponibles les premières semaines.",
    noteTitle: "Inscription (exemple)",
    noteBody:
      "Beaucoup de chatteries mentionnent une association (par ex. TICA). Remplacez cette ligne par vos affiliations réelles.",
  },
  varietiesPage: {
    title: "Looks préférés",
    kicker: "Motifs et couleurs",
    heading: "Vous cherchez un look particulier ?",
    lead:
      "Nous ne reproduisons pas le Bengal comme Pawtopia — mais nous aimons cette mise en page : montrer ce que votre programme explore pour rêver de façon responsable.",
    waitlist:
      "Si vous attendez un motif ou une couleur précis, indiquez-le dans votre candidature. La nature décide — nous ne promettons jamais de marquage exact.",
    card1Title: "Tabby classique chaleureux",
    card1Body: "Contraste lisible, rayures nettes et une personnalité \"près du feu\" dans plusieurs de nos lignées.",
    card2Title: "Robes unies douces",
    card2Body: "Couleur uniforme, texture pelucheuse et présence calme — idéal pour les minimalistes qui veulent un ours en peluche.",
    card3Title: "Bicolores discrets",
    card3Body: "Symétrie douce et regards tendres — souvent jumelés à des tempéraments bavards et collants.",
  },
  catCard: {
    age: "Âge",
    birthDate: "Date de naissance",
    gender: "Sexe",
    viewProfile: "Voir le profil",
  },
  status: {
    Available: "Disponible",
    Reserved: "Réservé",
    Sold: "Adopté",
    "Not for sale": "Non disponible",
  },
  gender: {
    Male: "Mâle",
    Female: "Femelle",
  },
  filters: {
    aria: "Filtrer les chats",
    breed: "Race",
    gender: "Sexe",
    status: "Statut",
    allBreeds: "Toutes les races",
    allGenders: "Tous",
    allStatuses: "Tous les statuts",
    male: "Mâle",
    female: "Femelle",
    available: "Disponible",
    reserved: "Réservé",
    sold: "Adopté",
    notForSale: "Non disponible",
    countOne: "1 chat",
    countMany: "{n} chats",
    emptyTitle: "Aucun chat ne correspond à ces filtres.",
    emptyHint: "Élargissez votre sélection.",
  },
  lightbox: {
    galleryAria: "Vignettes",
    openSr: "Ouvrir une vue agrandie",
    close: "Fermer",
    prev: "Précédent",
    next: "Suivant",
    dialogImage: "Aperçu de l'image",
  },
  form: {
    intro:
      "Dites-nous de quel chat vous vous approchez. Après l'envoi, votre appareil ouvre votre courriel avec un message prêt à envoyer.",
    name: "Nom",
    email: "Courriel",
    phone: "Téléphone",
    cat: "Chat concerné",
    notSure: "Pas encore certain·e",
    message: "Message",
    submit: "Ouvrir dans le courriel",
    errName: "Veuillez entrer votre nom.",
    errEmail: "Veuillez entrer un courriel valide.",
    errMessage: "Veuillez entrer un message.",
    errMailto:
      "Le site n'a pas d'adresse de contact valide. Définissez PUBLIC_CONTACT_EMAIL pour les builds de production.",
    mailSubjectPrefix: "Demande Willow Home :",
    mailBodyLabelName: "Nom",
    mailBodyLabelReplyEmail: "Répondre à",
    mailBodyLabelPhone: "Téléphone",
    mailBodyLabelCat: "Chat concerné",
    mailBodyLabelMessage: "Message",
    mailHint:
      "Lien mailto — votre propre application de courriel, sans API de formulaire externe. Les messages très longs peuvent être tronqués selon le navigateur.",
  },
};

export const messages: Record<Locale, Messages> = {
  en: messagesEn,
  fr: messagesFr,
};

export function getMessages(lang: string | undefined): Messages {
  return isLocale(lang) ? messages[lang] : messagesEn;
}
