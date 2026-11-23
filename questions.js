// =====================================================================
//   LISTE DES QUESTIONS DU QUIZ  (c'est ici que vous pouvez modifier !)
// =====================================================================
//
// Chaque ligne est UNE question, écrite comme ceci :
//
//   { matiere: "Maths", points: 1, question: "Combien font 5 × 6 ?", reponse: "30" },
//
//  - matiere  : "Français", "Maths", "Histoire-Géo", "Sciences", "Anglais" ou "Art"
//               (écrit exactement comme ça, avec les accents)
//  - points   : 1, 2 ou 3   (1 = facile ⭐, 2 = moyen ⭐⭐, 3 = difficile ⭐⭐⭐)
//  - question : le texte affiché sur la télé
//  - reponse  : la réponse, que seul le maître voit sur son téléphone
//
// POUR AJOUTER une question : copiez une ligne, collez-la juste en dessous,
// puis changez les textes.
//
// ⚠️ Trois pièges à éviter :
//   1. Gardez bien la virgule à la fin de chaque ligne.
//   2. Mettez les textes entre guillemets droits "...".
//   3. À l'intérieur d'un texte, n'utilisez pas de guillemets droits "
//      mais plutôt les guillemets français « ... ».
//   (Les apostrophes comme dans « l'océan » ne posent aucun problème.)
//
// Si une ligne est mal écrite, le jeu l'ignore et l'indique sur l'écran
// d'accueil de la télé.
// =====================================================================

const QUESTIONS = [

  // ---------------------------------------------------------- FRANÇAIS 📖
  { matiere: "Français", points: 1, question: "Quel est le contraire de « grand » ?", reponse: "Petit" },
  { matiere: "Français", points: 1, question: "Quel est le pluriel de « un cheval » ?", reponse: "Des chevaux" },
  { matiere: "Français", points: 1, question: "Quel est le contraire de « chaud » ?", reponse: "Froid" },
  { matiere: "Français", points: 1, question: "Quelle est la dernière lettre de l'alphabet ?", reponse: "Z" },
  { matiere: "Français", points: 1, question: "Quel est le contraire de « jour » ?", reponse: "Nuit" },
  { matiere: "Français", points: 1, question: "Combien y a-t-il de lettres dans le mot « chat » ?", reponse: "4" },
  { matiere: "Français", points: 1, question: "Quel est le féminin de « un lion » ?", reponse: "Une lionne" },
  { matiere: "Français", points: 1, question: "« Manger » : est-ce un nom ou un verbe ?", reponse: "Un verbe" },
  { matiere: "Français", points: 1, question: "Trouve un mot qui rime avec « bateau ».", reponse: "Par exemple : gâteau, château, chapeau…" },

  { matiere: "Français", points: 2, question: "Conjugue le verbe « être » avec « nous » au présent.", reponse: "Nous sommes" },
  { matiere: "Français", points: 2, question: "Quel est le féminin de « boulanger » ?", reponse: "Boulangère" },
  { matiere: "Français", points: 2, question: "Combien y a-t-il de lettres dans l'alphabet ?", reponse: "26" },
  { matiere: "Français", points: 2, question: "Quel est le pluriel de « un œil » ?", reponse: "Des yeux" },
  { matiere: "Français", points: 2, question: "Conjugue le verbe « avoir » avec « tu » au présent.", reponse: "Tu as" },
  { matiere: "Français", points: 2, question: "Combien y a-t-il de voyelles dans l'alphabet ?", reponse: "6 : a, e, i, o, u, y" },
  { matiere: "Français", points: 2, question: "Range dans l'ordre alphabétique : poire, banane, cerise.", reponse: "Banane, cerise, poire" },
  { matiere: "Français", points: 2, question: "Donne un mot qui veut dire la même chose que « content ».", reponse: "Heureux (ou joyeux)" },

  { matiere: "Français", points: 3, question: "Conjugue le verbe « aller » avec « ils » au futur.", reponse: "Ils iront" },
  { matiere: "Français", points: 3, question: "Conjugue le verbe « faire » avec « vous » au présent.", reponse: "Vous faites" },
  { matiere: "Français", points: 3, question: "Quel est le pluriel de « un journal » ?", reponse: "Des journaux" },
  { matiere: "Français", points: 3, question: "Conjugue le verbe « finir » avec « nous » au présent.", reponse: "Nous finissons" },
  { matiere: "Français", points: 3, question: "Dans la phrase « Le chien mange un os », quel est le verbe ?", reponse: "Mange" },
  { matiere: "Français", points: 3, question: "Dans la phrase « Le petit chat dort », quel est le sujet ?", reponse: "Le petit chat" },
  { matiere: "Français", points: 3, question: "Quel est le féminin de « un acteur » ?", reponse: "Une actrice" },
  { matiere: "Français", points: 3, question: "Conjugue le verbe « chanter » avec « je » à l'imparfait.", reponse: "Je chantais" },

  // ---------------------------------------------------------- MATHS 🔢
  { matiere: "Maths", points: 1, question: "Combien font 5 × 6 ?", reponse: "30" },
  { matiere: "Maths", points: 1, question: "Combien de côtés a un triangle ?", reponse: "3" },
  { matiere: "Maths", points: 1, question: "Combien font 4 + 9 ?", reponse: "13" },
  { matiere: "Maths", points: 1, question: "Combien font 3 × 4 ?", reponse: "12" },
  { matiere: "Maths", points: 1, question: "Combien de côtés a un carré ?", reponse: "4" },
  { matiere: "Maths", points: 1, question: "Quel est le double de 8 ?", reponse: "16" },
  { matiere: "Maths", points: 1, question: "Combien font 20 − 5 ?", reponse: "15" },
  { matiere: "Maths", points: 1, question: "Combien y a-t-il de jours dans une semaine ?", reponse: "7" },
  { matiere: "Maths", points: 1, question: "Quelle est la moitié de 10 ?", reponse: "5" },

  { matiere: "Maths", points: 2, question: "Combien font 7 × 8 ?", reponse: "56" },
  { matiere: "Maths", points: 2, question: "Combien y a-t-il de minutes dans une heure ?", reponse: "60" },
  { matiere: "Maths", points: 2, question: "Combien font 9 × 6 ?", reponse: "54" },
  { matiere: "Maths", points: 2, question: "Combien y a-t-il de mois dans une année ?", reponse: "12" },
  { matiere: "Maths", points: 2, question: "Combien font 45 + 38 ?", reponse: "83" },
  { matiere: "Maths", points: 2, question: "Combien y a-t-il de centimètres dans 1 mètre ?", reponse: "100" },
  { matiere: "Maths", points: 2, question: "Combien de faces a un cube ?", reponse: "6" },
  { matiere: "Maths", points: 2, question: "Quelle est la moitié de 50 ?", reponse: "25" },

  { matiere: "Maths", points: 3, question: "Combien font 100 − 37 ?", reponse: "63" },
  { matiere: "Maths", points: 3, question: "Un carré a des côtés de 4 cm. Quel est son périmètre ?", reponse: "16 cm" },
  { matiere: "Maths", points: 3, question: "Combien font 9 × 9 ?", reponse: "81" },
  { matiere: "Maths", points: 3, question: "Combien font 250 + 250 ?", reponse: "500" },
  { matiere: "Maths", points: 3, question: "Il est 9 h 45. Quelle heure sera-t-il dans 30 minutes ?", reponse: "10 h 15" },
  { matiere: "Maths", points: 3, question: "J'ai 3 paquets de 6 bonbons. Combien ai-je de bonbons en tout ?", reponse: "18" },
  { matiere: "Maths", points: 3, question: "Un rectangle mesure 5 cm de long et 2 cm de large. Quel est son périmètre ?", reponse: "14 cm" },
  { matiere: "Maths", points: 3, question: "Quel est le double de 35 ?", reponse: "70" },

  // ---------------------------------------------------------- HISTOIRE-GÉO 🌍
  { matiere: "Histoire-Géo", points: 1, question: "Quelle est la capitale de la France ?", reponse: "Paris" },
  { matiere: "Histoire-Géo", points: 1, question: "Quelles sont les trois couleurs du drapeau français ?", reponse: "Bleu, blanc, rouge" },
  { matiere: "Histoire-Géo", points: 1, question: "Comment s'appelle la grande tour en fer construite à Paris ?", reponse: "La tour Eiffel" },
  { matiere: "Histoire-Géo", points: 1, question: "Quelle langue parle-t-on en Espagne ?", reponse: "L'espagnol" },
  { matiere: "Histoire-Géo", points: 1, question: "Comment appelle-t-on une carte du monde en forme de boule ?", reponse: "Un globe" },
  { matiere: "Histoire-Géo", points: 1, question: "Comment s'appelle l'hymne national de la France ?", reponse: "La Marseillaise" },
  { matiere: "Histoire-Géo", points: 1, question: "Comment appelle-t-on la femme du roi ?", reponse: "La reine" },
  { matiere: "Histoire-Géo", points: 1, question: "Au Moyen Âge, qui habitait dans le château fort : le seigneur ou le paysan ?", reponse: "Le seigneur" },

  { matiere: "Histoire-Géo", points: 2, question: "Comment appelle-t-on les grands reptiles disparus il y a des millions d'années ?", reponse: "Les dinosaures" },
  { matiere: "Histoire-Géo", points: 2, question: "Quel est le plus grand océan du monde ?", reponse: "L'océan Pacifique" },
  { matiere: "Histoire-Géo", points: 2, question: "Quelle est la capitale de l'Italie ?", reponse: "Rome" },
  { matiere: "Histoire-Géo", points: 2, question: "Quelle est la plus haute montagne de France ?", reponse: "Le mont Blanc" },
  { matiere: "Histoire-Géo", points: 2, question: "Quelle est la capitale de l'Angleterre ?", reponse: "Londres" },
  { matiere: "Histoire-Géo", points: 2, question: "Comment s'appelle l'époque des chevaliers et des châteaux forts ?", reponse: "Le Moyen Âge" },
  { matiere: "Histoire-Géo", points: 2, question: "Quels sont les quatre points cardinaux ?", reponse: "Nord, sud, est, ouest" },
  { matiere: "Histoire-Géo", points: 2, question: "Quelle mer se trouve au sud de la France ?", reponse: "La mer Méditerranée" },
  { matiere: "Histoire-Géo", points: 2, question: "Quel grand animal poilu, cousin de l'éléphant, chassaient les hommes préhistoriques ?", reponse: "Le mammouth" },

  { matiere: "Histoire-Géo", points: 3, question: "Quel peuple a construit les pyramides de Gizeh ?", reponse: "Les Égyptiens de l'Antiquité" },
  { matiere: "Histoire-Géo", points: 3, question: "Quel est le plus long fleuve de France ?", reponse: "La Loire" },
  { matiere: "Histoire-Géo", points: 3, question: "Qui est le premier homme à avoir marché sur la Lune ?", reponse: "Neil Armstrong (en 1969)" },
  { matiere: "Histoire-Géo", points: 3, question: "Sur quel continent se trouve la France ?", reponse: "L'Europe" },
  { matiere: "Histoire-Géo", points: 3, question: "Comment s'appelle le très long mur construit en Chine ?", reponse: "La Grande Muraille (de Chine)" },
  { matiere: "Histoire-Géo", points: 3, question: "Quel roi de France était surnommé le « Roi-Soleil » ?", reponse: "Louis XIV" },
  { matiere: "Histoire-Géo", points: 3, question: "Comment appelle-t-on les dessins faits par les hommes préhistoriques sur les murs des grottes ?", reponse: "Des peintures rupestres (ou préhistoriques)" },
  { matiere: "Histoire-Géo", points: 3, question: "Quel océan borde l'ouest de la France ?", reponse: "L'océan Atlantique" },

  // ---------------------------------------------------------- SCIENCES 🔬
  { matiere: "Sciences", points: 1, question: "Combien de pattes a une araignée ?", reponse: "8" },
  { matiere: "Sciences", points: 1, question: "Qui pond des œufs : la poule ou la vache ?", reponse: "La poule" },
  { matiere: "Sciences", points: 1, question: "Comment s'appelle le bébé de la vache ?", reponse: "Le veau" },
  { matiere: "Sciences", points: 1, question: "Avec quelle partie du corps sent-on les odeurs ?", reponse: "Le nez" },
  { matiere: "Sciences", points: 1, question: "Quel astre nous éclaire pendant la journée ?", reponse: "Le Soleil" },
  { matiere: "Sciences", points: 1, question: "Quelle saison vient après l'hiver ?", reponse: "Le printemps" },
  { matiere: "Sciences", points: 1, question: "Combien avons-nous de sens ?", reponse: "5 (vue, ouïe, odorat, goût, toucher)" },
  { matiere: "Sciences", points: 1, question: "Combien de pattes a un chien ?", reponse: "4" },

  { matiere: "Sciences", points: 2, question: "Comment s'appelle le bébé de la grenouille ?", reponse: "Le têtard" },
  { matiere: "Sciences", points: 2, question: "Quel organe fait circuler le sang dans notre corps ?", reponse: "Le cœur" },
  { matiere: "Sciences", points: 2, question: "Combien de pattes a un insecte ?", reponse: "6" },
  { matiere: "Sciences", points: 2, question: "Comment s'appelle le bébé du mouton ?", reponse: "L'agneau" },
  { matiere: "Sciences", points: 2, question: "Combien y a-t-il de saisons dans une année ?", reponse: "4" },
  { matiere: "Sciences", points: 2, question: "Sur quelle planète vivons-nous ?", reponse: "La Terre" },
  { matiere: "Sciences", points: 2, question: "En quel insecte la chenille se transforme-t-elle ?", reponse: "En papillon" },
  { matiere: "Sciences", points: 2, question: "Comment appelle-t-on les animaux qui mangent de la viande ?", reponse: "Les carnivores" },
  { matiere: "Sciences", points: 2, question: "Quel est le plus grand animal du monde ?", reponse: "La baleine bleue" },

  { matiere: "Sciences", points: 3, question: "Comment appelle-t-on les animaux qui ne mangent que des plantes ?", reponse: "Les herbivores" },
  { matiere: "Sciences", points: 3, question: "Que devient l'eau quand elle gèle ?", reponse: "De la glace (elle devient solide)" },
  { matiere: "Sciences", points: 3, question: "Quel gaz de l'air respirons-nous pour vivre ?", reponse: "L'oxygène" },
  { matiere: "Sciences", points: 3, question: "À quelle température l'eau se met-elle à bouillir ?", reponse: "100 degrés (100 °C)" },
  { matiere: "Sciences", points: 3, question: "Comment s'appelle la partie de la plante qui est sous la terre ?", reponse: "Les racines" },
  { matiere: "Sciences", points: 3, question: "Comment appelle-t-on un animal qui mange de tout, des plantes et de la viande ?", reponse: "Un omnivore" },
  { matiere: "Sciences", points: 3, question: "Combien de temps met la Terre pour faire le tour du Soleil ?", reponse: "Un an (365 jours)" },
  { matiere: "Sciences", points: 3, question: "Lequel est un mammifère : le dauphin ou le requin ?", reponse: "Le dauphin" },

  // ---------------------------------------------------------- ANGLAIS 🗣️
  { matiere: "Anglais", points: 1, question: "Comment dit-on « chat » en anglais ?", reponse: "Cat" },
  { matiere: "Anglais", points: 1, question: "Que veut dire « red » ?", reponse: "Rouge" },
  { matiere: "Anglais", points: 1, question: "Comment dit-on « chien » en anglais ?", reponse: "Dog" },
  { matiere: "Anglais", points: 1, question: "Que veut dire « hello » ?", reponse: "Bonjour" },
  { matiere: "Anglais", points: 1, question: "Comment dit-on « bleu » en anglais ?", reponse: "Blue" },
  { matiere: "Anglais", points: 1, question: "Comment dit-on « un » (le chiffre 1) en anglais ?", reponse: "One" },
  { matiere: "Anglais", points: 1, question: "Que veut dire « yes » ?", reponse: "Oui" },
  { matiere: "Anglais", points: 1, question: "Comment dit-on « merci » en anglais ?", reponse: "Thank you" },

  { matiere: "Anglais", points: 2, question: "Comment dit-on « trois » en anglais ?", reponse: "Three" },
  { matiere: "Anglais", points: 2, question: "Comment dit-on « pomme » en anglais ?", reponse: "Apple" },
  { matiere: "Anglais", points: 2, question: "Que veut dire « green » ?", reponse: "Vert" },
  { matiere: "Anglais", points: 2, question: "Comment dit-on « maison » en anglais ?", reponse: "House" },
  { matiere: "Anglais", points: 2, question: "Que veut dire « Good night » ?", reponse: "Bonne nuit" },
  { matiere: "Anglais", points: 2, question: "Comment dit-on « dix » en anglais ?", reponse: "Ten" },
  { matiere: "Anglais", points: 2, question: "Que veut dire « mother » ?", reponse: "Mère (maman)" },
  { matiere: "Anglais", points: 2, question: "Comment dit-on « jaune » en anglais ?", reponse: "Yellow" },

  { matiere: "Anglais", points: 3, question: "Que veut dire « Thursday » ?", reponse: "Jeudi" },
  { matiere: "Anglais", points: 3, question: "Comment dit-on « Je m'appelle Léo » en anglais ?", reponse: "My name is Léo" },
  { matiere: "Anglais", points: 3, question: "Que veut dire « Monday » ?", reponse: "Lundi" },
  { matiere: "Anglais", points: 3, question: "Comment dit-on « Comment ça va ? » en anglais ?", reponse: "How are you?" },
  { matiere: "Anglais", points: 3, question: "Comment dit-on « vingt » en anglais ?", reponse: "Twenty" },
  { matiere: "Anglais", points: 3, question: "Que veut dire « I am eight years old » ?", reponse: "J'ai huit ans" },
  { matiere: "Anglais", points: 3, question: "Comment dit-on « oiseau » en anglais ?", reponse: "Bird" },
  { matiere: "Anglais", points: 3, question: "Que veut dire « Sunday » ?", reponse: "Dimanche" },
  { matiere: "Anglais", points: 3, question: "Comment dit-on « J'aime les pommes » en anglais ?", reponse: "I like apples" },

  // ---------------------------------------------------------- ART 🎨
  { matiere: "Art", points: 1, question: "Quelle couleur obtient-on en mélangeant du bleu et du jaune ?", reponse: "Vert" },
  { matiere: "Art", points: 1, question: "Quelle couleur obtient-on en mélangeant du rouge et du blanc ?", reponse: "Rose" },
  { matiere: "Art", points: 1, question: "Quel instrument de musique a des touches noires et blanches ?", reponse: "Le piano" },
  { matiere: "Art", points: 1, question: "Quelle couleur obtient-on en mélangeant du noir et du blanc ?", reponse: "Gris" },
  { matiere: "Art", points: 1, question: "Comment s'appelle l'objet avec des poils qui sert à peindre ?", reponse: "Un pinceau" },
  { matiere: "Art", points: 1, question: "Quel instrument de musique frappe-t-on avec des baguettes ?", reponse: "Le tambour (ou la batterie)" },
  { matiere: "Art", points: 1, question: "Quelle couleur obtient-on en mélangeant du bleu et du rouge ?", reponse: "Violet" },
  { matiere: "Art", points: 1, question: "Comment appelle-t-on une personne qui fait des sculptures ?", reponse: "Un sculpteur (une sculptrice)" },

  { matiere: "Art", points: 2, question: "Quel peintre célèbre a peint La Joconde ?", reponse: "Léonard de Vinci" },
  { matiere: "Art", points: 2, question: "Quelle couleur obtient-on en mélangeant du rouge et du jaune ?", reponse: "Orange" },
  { matiere: "Art", points: 2, question: "Quelles sont les trois couleurs primaires ?", reponse: "Rouge, jaune, bleu" },
  { matiere: "Art", points: 2, question: "Comment appelle-t-on la personne qui dirige un orchestre ?", reponse: "Le chef d'orchestre" },
  { matiere: "Art", points: 2, question: "Comment appelle-t-on un tableau qui montre le visage d'une personne ?", reponse: "Un portrait" },
  { matiere: "Art", points: 2, question: "Comment appelle-t-on un tableau qui montre la nature, la campagne ou la mer ?", reponse: "Un paysage" },
  { matiere: "Art", points: 2, question: "Combien de cordes a une guitare classique ?", reponse: "6" },
  { matiere: "Art", points: 2, question: "Comment s'appelle la danse où l'on danse sur la pointe des pieds avec un tutu ?", reponse: "La danse classique (le ballet)" },

  { matiere: "Art", points: 3, question: "Dans quel musée de Paris peut-on voir La Joconde ?", reponse: "Le Louvre" },
  { matiere: "Art", points: 3, question: "Quel peintre a peint « La Nuit étoilée » ?", reponse: "Vincent Van Gogh" },
  { matiere: "Art", points: 3, question: "Combien y a-t-il de notes dans la gamme : do, ré, mi… ?", reponse: "7 (do, ré, mi, fa, sol, la, si)" },
  { matiere: "Art", points: 3, question: "Quel peintre a peint « Les Nymphéas » ?", reponse: "Claude Monet" },
  { matiere: "Art", points: 3, question: "Quel musicien célèbre a composé « La Flûte enchantée » ?", reponse: "Mozart" },
  { matiere: "Art", points: 3, question: "Comment s'appelle la planche sur laquelle le peintre mélange ses couleurs ?", reponse: "La palette" },
  { matiere: "Art", points: 3, question: "Comment appelle-t-on un tableau qui montre des fruits, des fleurs ou des objets ?", reponse: "Une nature morte" },
  { matiere: "Art", points: 3, question: "Dans quel pays est né Léonard de Vinci ?", reponse: "En Italie" },
  { matiere: "Art", points: 3, question: "Quel instrument de musique se joue avec un archet ?", reponse: "Le violon (ou le violoncelle)" },

];
