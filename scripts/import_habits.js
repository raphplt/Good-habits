import { db } from "../db/index.ts/index.js";

// Fonction pour importer le JSON dans la collection "habits"
const importerJSONDansFirestore = async (jsonDonnees) => {
	try {
		// Référence à la collection "habits"
		const habitsCollectionRef = collection(db, "habits");

		// Importer chaque élément du JSON dans la collection
		for (const habit of jsonDonnees) {
			await addDoc(habitsCollectionRef, habit);
		}

		console.log("Données importées avec succès dans la collection 'habits'");
	} catch (error) {
		console.error(
			"Erreur lors de l'importation des données dans Firestore : ",
			error
		);
	}
};

// Exemple de JSON à importer
const exempleJSON = [
	{
		name: "Lecture quotidienne",
		description:
			"Lire un livre ou un article pendant au moins 30 minutes par jour pour enrichir ses connaissances.",
		difficulty: 2,
		category: "Lecture",
		icon: "book",
		color: "#3498db",
		duration: 30,
	},
	{
		name: "Méditation matinale",
		description:
			"Pratiquer la méditation pendant 10 minutes chaque matin pour commencer la journée en pleine conscience.",
		difficulty: 3,
		category: "Méditation",
		icon: "meditation",
		color: "#2ecc71",
		duration: 10,
	},
	{
		name: "Footing",
		description:
			"Faire un jogging léger pendant 20 minutes pour maintenir une activité physique régulière.",
		difficulty: 4,
		category: "Exercice physique",
		icon: "running",
		color: "#e74c3c",
		duration: 20,
	},
	{
		name: "Séance de musculation",
		description:
			"Effectuer une séance de musculation ciblée (ex. : renforcement musculaire) pendant 45 minutes.",
		difficulty: 5,
		category: "Exercice physique",
		icon: "dumbbell",
		color: "#e74c3c",
		duration: 45,
	},
	{
		name: "Boire un verre d'eau",
		description: "Boire un grand verre d'eau chaque matin pour rester hydraté.",
		difficulty: 1,
		category: "Santé",
		icon: "water",
		color: "#3498db",
		duration: 2,
	},
	{
		name: "Planification de la journée",
		description:
			"Planifier les tâches de la journée chaque matin pour une meilleure productivité.",
		difficulty: 2,
		category: "Productivité",
		icon: "calendar",
		color: "#f39c12",
		duration: 15,
	},
	{
		name: "Étirements",
		description:
			"Faire des étirements légers pendant 15 minutes pour améliorer la souplesse.",
		difficulty: 3,
		category: "Bien-être",
		icon: "stretching",
		color: "#9b59b6",
		duration: 15,
	},
	{
		name: "Écriture créative",
		description:
			"Écrire une courte histoire ou un poème chaque jour pour stimuler la créativité.",
		difficulty: 2,
		category: "Créativité",
		icon: "pen",
		color: "#3498db",
		duration: 20,
	},
	{
		name: "Pause active",
		description:
			"Faire une pause active toutes les heures en effectuant des exercices rapides (ex. : sauts, squats).",
		difficulty: 3,
		category: "Exercice physique",
		icon: "active",
		color: "#e74c3c",
		duration: 5,
	},
	{
		name: "Analyse de la journée",
		description:
			"Réfléchir sur les événements de la journée pendant 10 minutes avant le coucher.",
		difficulty: 2,
		category: "Réflexion",
		icon: "thoughts",
		color: "#9b59b6",
		duration: 10,
	},
	{
		name: "Yoga matinal",
		description:
			"Pratiquer une séance de yoga matinale de 20 minutes pour améliorer la flexibilité et la concentration.",
		difficulty: 3,
		category: "Bien-être",
		icon: "yoga",
		color: "#2ecc71",
		duration: 20,
	},
	{
		name: "Apprentissage d'une nouvelle compétence",
		description:
			"Allouer 30 minutes par jour pour apprendre une nouvelle compétence (ex. : langues, programmation).",
		difficulty: 4,
		category: "Développement personnel",
		icon: "learning",
		color: "#3498db",
		duration: 30,
	},
	{
		name: "Petite marche après le déjeuner",
		description:
			"Faire une courte marche de 15 minutes après le déjeuner pour favoriser la digestion et l'énergie.",
		difficulty: 2,
		category: "Exercice physique",
		icon: "walking",
		color: "#e74c3c",
		duration: 15,
	},
	{
		name: "Pause méditative",
		description:
			"Prendre une pause de méditation de 5 minutes au milieu de la journée pour se recentrer.",
		difficulty: 2,
		category: "Méditation",
		icon: "meditation",
		color: "#2ecc71",
		duration: 5,
	},
	{
		name: "Routine de gratitude",
		description:
			"Écrire trois choses pour lesquelles vous êtes reconnaissant chaque soir avant de dormir.",
		difficulty: 1,
		category: "Bien-être",
		icon: "gratitude",
		color: "#f39c12",
		duration: 10,
	},
	{
		name: "Cours de cuisine saine",
		description:
			"Préparer un repas sain chaque jour en suivant une recette nutritive.",
		difficulty: 3,
		category: "Nutrition",
		icon: "cooking",
		color: "#e74c3c",
		duration: 45,
	},
	{
		name: "Séance de brainstorming",
		description:
			"Prendre 20 minutes pour générer des idées créatives ou résoudre un problème spécifique.",
		difficulty: 2,
		category: "Créativité",
		icon: "brainstorm",
		color: "#9b59b6",
		duration: 20,
	},
	{
		name: "Écoute de podcast éducatif",
		description:
			"Écouter un podcast éducatif pendant 30 minutes pour rester informé sur un sujet d'intérêt.",
		difficulty: 2,
		category: "Apprentissage",
		icon: "podcast",
		color: "#3498db",
		duration: 30,
	},
	{
		name: "Routine de stretching nocturne",
		description:
			"Effectuer des étirements doux pendant 10 minutes avant de se coucher pour favoriser la relaxation.",
		difficulty: 1,
		category: "Bien-être",
		icon: "stretching",
		color: "#2ecc71",
		duration: 10,
	},
	{
		name: "Séance de lecture inspirante",
		description:
			"Lire un livre ou un article inspirant pendant 20 minutes avant de commencer la journée.",
		difficulty: 2,
		category: "Lecture",
		icon: "book",
		color: "#3498db",
		duration: 20,
	},
	{
		name: "Entraînement en force",
		description:
			"Faire une séance d'entraînement en force de 45 minutes pour renforcer les muscles.",
		difficulty: 4,
		category: "Exercice physique",
		icon: "weightlifting",
		color: "#e74c3c",
		duration: 45,
	},
	{
		name: "Course à pied",
		description:
			"Faire une course à pied de 30 minutes pour améliorer l'endurance cardiovasculaire.",
		difficulty: 3,
		category: "Cardio",
		icon: "running",
		color: "#e74c3c",
		duration: 30,
	},
	{
		name: "Séance de yoga énergétique",
		description:
			"Pratiquer une séance de yoga énergétique de 20 minutes pour améliorer la souplesse et l'équilibre.",
		difficulty: 2,
		category: "Bien-être",
		icon: "yoga",
		color: "#2ecc71",
		duration: 20,
	},
	{
		name: "Haltérophilie",
		description:
			"Incorporer une séance d'haltérophilie de 30 minutes pour améliorer la force et la puissance.",
		difficulty: 4,
		category: "Exercice physique",
		icon: "weightlifting",
		color: "#e74c3c",
		duration: 30,
	},
	{
		name: "Natation",
		description:
			"Nager pendant 40 minutes pour un exercice cardio complet et une amélioration de la capacité respiratoire.",
		difficulty: 3,
		category: "Cardio",
		icon: "swimming",
		color: "#3498db",
		duration: 40,
	},
	{
		name: "Séance d'étirements post-entraînement",
		description:
			"Dédier 15 minutes à des étirements post-entraînement pour améliorer la flexibilité et prévenir les blessures.",
		difficulty: 2,
		category: "Bien-être",
		icon: "stretching",
		color: "#2ecc71",
		duration: 15,
	},
	{
		name: "Entraînement en intervalles",
		description:
			"Effectuer un entraînement en intervalles de haute intensité (HIIT) pendant 20 minutes pour brûler des calories.",
		difficulty: 4,
		category: "Exercice physique",
		icon: "hiit",
		color: "#e74c3c",
		duration: 20,
	},
	{
		name: "Randonnée",
		description:
			"Faire une randonnée en plein air pendant 1 heure pour combiner exercice et contact avec la nature.",
		difficulty: 3,
		category: "Cardio",
		icon: "hiking",
		color: "#3498db",
		duration: 60,
	},
	{
		name: "Entraînement abdominal",
		description:
			"Dédier 15 minutes à un entraînement ciblé des abdominaux pour renforcer la sangle abdominale.",
		difficulty: 3,
		category: "Exercice physique",
		icon: "abs",
		color: "#e74c3c",
		duration: 15,
	},
	{
		name: "Séance de récupération",
		description:
			"Inclure une séance de récupération active, telle que le stretching ou le yoga, pour favoriser la récupération musculaire.",
		difficulty: 2,
		category: "Bien-être",
		icon: "recovery",
		color: "#2ecc71",
		duration: 20,
	},
	{
		name: "Lecture quotidienne d'articles",
		description:
			"Lire un article informatif chaque jour pour rester au courant des dernières avancées dans votre domaine d'intérêt.",
		difficulty: 2,
		category: "Lecture",
		icon: "book",
		color: "#3498db",
		duration: 20,
	},
	{
		name: "Cours en ligne",
		description:
			"Suivre un cours en ligne sur une plateforme éducative pour acquérir de nouvelles compétences.",
		difficulty: 3,
		category: "Formation",
		icon: "learning",
		color: "#3498db",
		duration: 30,
	},
	{
		name: "Pratique quotidienne d'une langue étrangère",
		description:
			"Consacrer 15 minutes chaque jour à la pratique d'une langue étrangère à l'aide d'applications ou de ressources en ligne.",
		difficulty: 2,
		category: "Langues",
		icon: "language",
		color: "#2ecc71",
		duration: 15,
	},
	{
		name: "Projet personnel de programmation",
		description:
			"Travailler sur un projet de programmation personnel pour appliquer et renforcer vos compétences en codage.",
		difficulty: 4,
		category: "Développement informatique",
		icon: "coding",
		color: "#e74c3c",
		duration: 45,
	},
	{
		name: "Écoute de podcasts éducatifs",
		description:
			"Écouter des podcasts éducatifs sur des sujets variés pour enrichir vos connaissances pendant vos déplacements.",
		difficulty: 2,
		category: "Apprentissage",
		icon: "podcast",
		color: "#3498db",
		duration: 20,
	},
	{
		name: "Révision quotidienne des notes",
		description:
			"Consacrer 10 minutes chaque jour à la révision des notes prises lors de cours ou de lectures.",
		difficulty: 2,
		category: "Organisation",
		icon: "notes",
		color: "#f39c12",
		duration: 10,
	},
	{
		name: "Participation à des webinaires",
		description:
			"Assister à des webinaires ou des conférences en ligne pour découvrir de nouvelles perspectives dans votre domaine d'étude.",
		difficulty: 3,
		category: "Formation",
		icon: "webinar",
		color: "#3498db",
		duration: 30,
	},
	{
		name: "Résolution de problèmes quotidiens",
		description:
			"S'engager à résoudre un problème complexe chaque jour pour développer la pensée critique et la résolution de problèmes.",
		difficulty: 4,
		category: "Développement personnel",
		icon: "problem-solving",
		color: "#e74c3c",
		duration: 30,
	},
	{
		name: "Lecture de livres spécialisés",
		description:
			"Lire des livres spécialisés dans votre domaine d'étude pour approfondir vos connaissances et perspectives.",
		difficulty: 3,
		category: "Lecture",
		icon: "book",
		color: "#3498db",
		duration: 25,
	},
	{
		name: "Participation à des forums de discussion",
		description:
			"S'impliquer dans des forums de discussion en ligne pour échanger des idées et apprendre des expériences d'autres personnes.",
		difficulty: 2,
		category: "Réseautage",
		icon: "forum",
		color: "#9b59b6",
		duration: 20,
	},
	{
		name: "Écoute de musique relaxante",
		description:
			"Écouter de la musique apaisante pendant 15 minutes pour élever l'humeur et réduire le stress.",
		difficulty: 1,
		category: "Bien-être",
		icon: "music",
		color: "#3498db",
		duration: 15,
	},
	{
		name: "Journée sans écrans",
		description:
			"Dédier une journée par semaine sans écrans (téléphone, ordinateur) pour se déconnecter et se ressourcer.",
		difficulty: 3,
		category: "Digital Detox",
		icon: "screen-free",
		color: "#f39c12",
		duration: 1440,
	},
	{
		name: "Gratitude quotidienne",
		description:
			"Écrire trois choses pour lesquelles vous êtes reconnaissant chaque jour pour cultiver un état d'esprit positif.",
		difficulty: 1,
		category: "Bien-être",
		icon: "gratitude",
		color: "#f39c12",
		duration: 10,
	},
	{
		name: "Bain relaxant",
		description:
			"Prendre un bain relaxant aux sels d'Epsom pendant 30 minutes pour détendre les muscles et apaiser l'esprit.",
		difficulty: 2,
		category: "Bien-être",
		icon: "bath",
		color: "#2ecc71",
		duration: 30,
	},
	{
		name: "Promenade dans la nature",
		description:
			"Faire une promenade de 30 minutes dans la nature pour revitaliser l'esprit et profiter de l'air frais.",
		difficulty: 2,
		category: "Bien-être",
		icon: "nature-walk",
		color: "#2ecc71",
		duration: 30,
	},
	{
		name: "Yoga du soir",
		description:
			"Pratiquer une séance de yoga doux de 20 minutes avant le coucher pour favoriser un sommeil réparateur.",
		difficulty: 2,
		category: "Yoga",
		icon: "yoga",
		color: "#2ecc71",
		duration: 20,
	},
	{
		name: "Entraînement cardio HIIT",
		description:
			"Faire une séance d'entraînement cardio HIIT de 20 minutes pour brûler des calories et améliorer la condition physique.",
		difficulty: 4,
		category: "Exercice physique",
		icon: "hiit",
		color: "#e74c3c",
		duration: 20,
	},
	{
		name: "Partie de tennis",
		description:
			"Jouer au tennis pendant 1 heure pour stimuler la coordination et améliorer la condition physique.",
		difficulty: 3,
		category: "Sport",
		icon: "tennis",
		color: "#e74c3c",
		duration: 60,
	},
	{
		name: "Séance de boxe",
		description:
			"Faire une séance de boxe de 45 minutes pour libérer le stress et améliorer la force musculaire.",
		difficulty: 4,
		category: "Exercice physique",
		icon: "boxing",
		color: "#e74c3c",
		duration: 45,
	},
	{
		name: "Randonnée à vélo",
		description:
			"Faire une randonnée à vélo de 1 heure pour profiter du plein air tout en renforçant les muscles des jambes.",
		difficulty: 3,
		category: "Cyclisme",
		icon: "cycling",
		color: "#3498db",
		duration: 60,
	},
];

// Appelez la fonction avec votre JSON
importerJSONDansFirestore(exempleJSON);
