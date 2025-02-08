import { Button, Card, Image } from "@heroui/react";
import { CalenderIcon } from "../icons/CalenderIcon";
import { LocationIcon } from "../icons/LocationIcon";
import { DateTime } from "luxon";

interface EventDetailsProps {
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
  onClose: () => void;
}

const EventDetails = ({ event, onClose }: EventDetailsProps) => {
  const formatDateTime = (dateString: string) => {
    return DateTime.fromISO(dateString).toFormat("EEE, MMM dd, yyyy h:mm a");
  };

  const startDateTime = formatDateTime(event.date);
  const endDateTime = formatDateTime(event.endDate);
  const isPastEvent = new Date(event.endDate) < new Date();
  return (
    <>
      <div className="relative">
        <Image
          src={event.imageUrl || "/default-event-image.jpg"}
          alt={event.title}
          className="w-full h-[250px] object-cover"
          width={400}
          height={250}
        />
      </div>

      <Card className="p-5 bg-[#404040] text-white">
        <h4 className="font-bold text-lg">{event.title}</h4>
        <div className="flex items-center text-sm text-gray-400 justify-between mt-3">
          <div className="flex items-center gap-2">
            <CalenderIcon />
            <div className="flex flex-col">
              <span className="text-sm">Start: {startDateTime}</span>
              <span className="text-sm">End: {endDateTime}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <LocationIcon />
            <span>{event.location}</span>
          </div>
        </div>
      </Card>

      <Card className="p-5 mt-4 bg-[#404040]">
        <h5 className="font-semibold text-white">About Event</h5>
        <p className="text-sm mt-1 text-gray-400">{event.description}</p>
        <p className="text-sm mt-3 text-gray-400">
          <span className="font-bold text-gray-300">Category:</span>{" "}
          {event.category}
        </p>
      </Card>

      <div className="flex gap-4 mt-4">
        <Button onPress={onClose} fullWidth>
          Close
        </Button>
        {!isPastEvent && (
          <Button className="bg-[#f1f754]" fullWidth>
            Join Now
          </Button>
        )}
      </div>
    </>
  );
};
export default EventDetails;
