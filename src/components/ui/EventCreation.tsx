import {
  Button,
  DateInputValue,
  DatePicker,
  Form,
  Input,
  Select,
  SelectItem,
  TimeInput,
  TimeInputValue,
} from "@heroui/react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCategory } from "../../redux/event/eventSlice";
import { AppDispatch } from "../../redux/store";
import uploadToCloudinary from "../../hooks/uploadToCloudinary";
import { createEvent, fetchEvents } from "../../redux/event/eventAction";
import { selectCurrentAuth } from "../../redux/auth/authSlice";
import { useLoadingAction } from "../../hooks/useLoading";

interface EventCreationProps {
  onClose: () => void;
}

const EventCreation = ({ onClose }: EventCreationProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const currentAuth = useSelector(selectCurrentAuth);
  const [error, setError] = useState({});
  const [startDate, setStartDate] = useState<DateInputValue | null>(null);
  const [endDate, setEndDate] = useState<DateInputValue | null>(null);
  const [startTime, setStartTime] = useState<TimeInputValue | null>(null);
  const [endTime, setEndTime] = useState<TimeInputValue | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  //const [imageUrl, setImageUrl] = useState<string>("");

  const categories = useSelector(getCategory);
  const { withLoading } = useLoadingAction();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const handleCreateEvent = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError({});

    const data = Object.fromEntries(new FormData(e.currentTarget));
    console.log("data", data);

    const validationErrors: Record<string, string> = {};

    if (!data.eventname) {
      validationErrors.eventname = "Event Title is required";
    }
    if (!data.eventdesc) {
      validationErrors.eventdesc = "Event Description is required";
    }
    if (!startDate) {
      validationErrors.startdate = "Event Start Date is required";
    }
    if (!startTime) {
      validationErrors.starttime = "Event Start Time is required";
    }
    if (!endDate) {
      validationErrors.enddate = "Event End Date is required";
    }
    if (!endTime) {
      validationErrors.endtime = "Event End Time is required";
    }
    if (!data.eventloc) {
      validationErrors.eventloc = "Event location is required";
    }
    if (!data.eventcategory) {
      validationErrors.eventcategory = "Event category is required";
    }

    if (Object.keys(validationErrors).length > 0) {
      setError(validationErrors);
      return;
    }

    // Combine date and time
    const startDateTime = startDate
      ? new Date(startDate.year, startDate.month - 1, startDate.day)
      : new Date();

    console.log("startDateTime", startDateTime);
    const endDateTime = endDate
      ? new Date(endDate.year, endDate.month - 1, endDate.day)
      : new Date();
    console.log("endDateTime", endDateTime);

    if (startTime) {
      const [hours, minutes] = startTime.toString().split(":");
      startDateTime.setHours(parseInt(hours), parseInt(minutes));
    }

    if (endTime) {
      const [hours, minutes] = endTime.toString().split(":");
      endDateTime.setHours(parseInt(hours), parseInt(minutes));
    }

    try {
      await withLoading(async () => {
        let uploadImageUrl = "";

        if (selectedImage) {
          uploadImageUrl = await uploadToCloudinary(selectedImage);
        }

        const eventData = {
          title: data.eventname as string,
          description: data.eventdesc as string,
          date: startDateTime.toISOString(),
          endDate: endDateTime.toISOString(),
          category: data.eventcategory as string,
          location: data.eventloc as string,
          maxAttendees: parseInt(data.eventmaxattend as string) || 100,
          isPublic: true,
          imageUrl: uploadImageUrl,
          creatorId: currentAuth.id,
        };
        console.log("Event Data:", eventData);
        await dispatch(createEvent(eventData));
        onClose();
        await dispatch(fetchEvents("All"));
      }, "event");
    } catch (err) {
      console.error("Failed to create event:", err);
    }
  };
  return (
    <div>
      <Form onSubmit={handleCreateEvent} validationErrors={error}>
        <div className="w-full space-y-6">
          <Input name="eventname" label="Event Title" fullWidth />
          <Input name="eventdesc" label="Event Description" fullWidth />
          <div className="flex gap-6">
            <DatePicker
              label="Event StartDate"
              name="startdate"
              value={startDate}
              onChange={setStartDate}
            />
            <TimeInput
              label="Event StartTime"
              name="starttime"
              value={startTime}
              onChange={setStartTime}
            />
          </div>
          <div className="flex gap-6">
            <DatePicker
              label="Event EndDate"
              name="enddate"
              value={endDate}
              onChange={setEndDate}
            />
            <TimeInput
              label="Event EndTime"
              name="endtime"
              value={endTime}
              onChange={setEndTime}
            />
          </div>
          <Input name="eventloc" label="Location" fullWidth />
          <div className="flex gap-6">
            <Select label="Select Event Category" name="eventcategory">
              {categories
                .filter((category) => category.categoryname !== "All")
                .map((category) => (
                  <SelectItem
                    key={category.categoryname}
                    value={category.categoryname}
                  >
                    {category.categoryname}
                  </SelectItem>
                ))}
            </Select>
            <Input
              name="eventmaxattend"
              label="Maximum Attendees"
              type="number"
              fullWidth
            />
          </div>
          <Input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            label="Add Photos"
          >
            {selectedImage && (
              <img
                src={URL.createObjectURL(selectedImage)}
                alt="Preview"
                className="mt-2 rounded-lg max-h-40 object-cover"
              />
            )}
          </Input>
          <Button color="warning" type="submit" fullWidth>
            Submit
          </Button>
        </div>
      </Form>
    </div>
  );
};
export default EventCreation;
