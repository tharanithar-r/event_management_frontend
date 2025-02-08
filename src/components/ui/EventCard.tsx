import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
} from "@heroui/react";
import { DateTime } from "luxon";
import EventDetails from "./EventDetails";
import { useState } from "react";

interface EventCardProps {
  event: {
    id: string;
    title: string;
    description: string;
    date: string;
    endDate: string;
    category: string;
    imageUrl?: string;
    location?: string;
    maxAttendees: number;
    isPublic: boolean;
  };
}

const EventCard = ({ event }: EventCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const formatDate = (dateString: string) => {
    const date = DateTime.fromISO(dateString);
    return {
      month: date.toFormat("MMM"),
      day: date.toFormat("dd"),
      fullDate: date.toFormat("MMM dd, yyyy h:mm a"),
    };
  };

  const startDate = formatDate(event.date);
  const isPastEvent = new Date(event.endDate) < new Date();
  //const endDate = formatDate(event.endDate);
  return (
    <>
      <Card className="" isPressable onPress={() => setIsModalOpen(true)}>
        <div className="relative flex justify-center items-center p-4">
          <Image
            alt={event.title}
            className="w-full h-[200px] object-cover rounded-2xl"
            src={event.imageUrl || "/default-event-image.jpg"}
          />
        </div>

        <CardBody className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-bold text-lg">{event.title}</h4>
              <p className="text-sm text-gray-400">{event.location}</p>
            </div>
            <Card className="px-3 py-1 rounded-lg text-xs ml-4">
              <span className="block font-bold text-sm text-center">
                {startDate.month}
              </span>
              <span className="block text-lg text-center">{startDate.day}</span>
            </Card>
          </div>
        </CardBody>

        <CardFooter className="flex justify-between items-center p-4">
          {!isPastEvent && (
            <Button color="warning" className="font-bold" radius="full">
              Join now
            </Button>
          )}
        </CardFooter>
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        placement="center"
        size="full"
        className="bg-black text-white"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-center text-white">
                Event Details
              </ModalHeader>
              <ModalBody>
                <EventDetails event={event} onClose={onClose} />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default EventCard;
