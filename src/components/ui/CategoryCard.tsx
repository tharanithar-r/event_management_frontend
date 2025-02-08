import { memo } from "react";
import { Card, CardBody } from "@heroui/react";

interface CategoryCardProps {
  category: string;
  isSelected: boolean;
  onSelect: (category: string) => void;
}

const CategoryCard = memo(
  ({ category, isSelected, onSelect }: CategoryCardProps) => (
    <Card
      isPressable
      className={`flex items-center justify-center min-w-fit text-sm font-medium  ${
        isSelected ? "!border-solid border-2 !border-primary text-primary" : ""
      }`}
      onPress={() => onSelect(category)}
    >
      <CardBody>{category}</CardBody>
    </Card>
  )
);

export default CategoryCard;
