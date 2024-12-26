import { CategoryTypeSelect } from "@utils/category.type";

export const customMessage = (type: string) => {
	switch (type) {
		case CategoryTypeSelect.positive:
			return "Instaurez une nouvelle habitude dans votre quotidien, vous êtes sur la bonne voie";
		case CategoryTypeSelect.negative:
			return "Laissez derrière vous une habitude qui vous empêche d'avancer";
		default:
			return "Faites une activité qui vous fait du bien";
	}
};
