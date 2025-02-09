//const backendURL = import.meta.env.VITE_BACKEND_URL;

import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Tab,
  Tabs,
  useDisclosure,
} from "@heroui/react";
import { SearchIcon } from "../components/icons/SearchIcon";
import { setSearchquery } from "../redux/searchSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { FilterIcon } from "../components/icons/FilterIcon";
import EventCreation from "../components/ui/EventCreation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { fetchCategories, fetchEvents } from "../redux/event/eventAction";
import CategoryCard from "../components/ui/CategoryCard";
import { setSelectedCategory } from "../redux/event/eventSlice";
import EventCard from "../components/ui/EventCard";
//import CategoryCard from "../components/ui/CategoryCard";

const Home = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [selected, setSelected] = useState("upcoming");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { categories, selectedCategory, events } = useSelector(
    (state: RootState) => state.event
  );
  const searchQuery = useSelector(
    (state: RootState) => state.search.searchQuery
  );

  useEffect(() => {
    const fetchCategoriesData = async () => {
      await dispatch(fetchCategories());
      await dispatch(fetchEvents("All"));
    };

    fetchCategoriesData();
  }, [dispatch]);

  useEffect(() => {
    if (selectedCategory) {
      dispatch(fetchEvents(selectedCategory));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory]);

  const handleCategorySelect = useCallback(
    (category: string) => {
      dispatch(setSearchquery(""));
      dispatch(setSelectedCategory(category));
    },
    [dispatch]
  );

  const filteredEvents = useMemo(() => {
    let filtered = events;
    if (searchQuery) {
      filtered = events.filter((event) =>
        event.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    const currentDate = new Date();
    return filtered.filter((event) => {
      const eventEndDate = new Date(event.endDate);
      if (selected === "upcoming") {
        return eventEndDate >= currentDate;
      } else {
        return eventEndDate < currentDate;
      }
    });
  }, [events, searchQuery, selected]);

  return (
    <>
      <div className="p-4">
        <div className="flex gap-3 mt-3">
          <Input
            className="w-full"
            placeholder="Discover"
            startContent={<SearchIcon />}
            value={searchQuery}
            onChange={(e) => dispatch(setSearchquery(e.target.value))}
            isClearable
            onClear={() => dispatch(setSearchquery(""))}
            radius="full"
          />
          <Button isIconOnly radius="full">
            <FilterIcon />
          </Button>
        </div>

        <div className="flex overflow-x-auto gap-3 my-4 ">
          {categories.map((category) => (
            <CategoryCard
              key={category.categoryname}
              category={category.categoryname}
              isSelected={selectedCategory === category.categoryname}
              onSelect={handleCategorySelect}
            />
          ))}
        </div>

        <div className="flex w-full justify-center items-center px-4">
          <Tabs
            aria-label="Options"
            selectedKey={selected}
            onSelectionChange={(key) => setSelected(key.toString())}
            size="md"
          >
            <Tab key="upcoming" title="Upcoming"></Tab>
            <Tab key="past" title="Past"></Tab>
          </Tabs>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-6">
          {filteredEvents.length === 0 ? (
            <div className="col-span-full text-center text-gray-500 py-8">
              {searchQuery
                ? `No events found matching "${searchQuery}"`
                : `No ${selected} events found`}
            </div>
          ) : (
            filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))
          )}
        </div>
        <Button
          color="warning"
          className="fixed bottom-6 right-6 shadow-lg z-50 px-6"
          onPress={onOpen}
          radius="full"
          variant="flat"
          startContent={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path
                fillRule="evenodd"
                d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z"
                clipRule="evenodd"
              />
            </svg>
          }
        >
          Create Event
        </Button>
      </div>
      <div>
        <Modal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          size="full"
          className="dark overflow-scroll"
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1 text-center text-white">
                  Create Event
                </ModalHeader>
                <ModalBody>
                  <EventCreation onClose={onClose} />
                </ModalBody>
                <ModalFooter></ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
    </>
  );
};

export default Home;
