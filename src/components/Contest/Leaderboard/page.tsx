import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AvatarImage } from "@radix-ui/react-avatar";
import {
  ArrowLeft,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Medal,
  Quote,
  Search,
  Timer,
  Trophy,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";

interface Participant {
  id: string;
  name: string;
  image: string;
  username: string;
  score: number;
  last_submission_at: string;
}

export default function LeaderBoardPage({
  props,
  id,
  baseUrl,
}: {
  props: any;
  id: string;
  baseUrl: string;
}) {
  const { name, startDate, endDate, countPart } = props;

  const [isLoading, setIsLoading] = useState(false);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [displayedParticipants, setDisplayedParticipants] = useState<
    Participant[]
  >([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const participantsPerPage = 10;

  const formatDate = (date: string) => {
    const d = new Date(date);
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTimeDifference = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diff = Math.abs(endDate.getTime() - startDate.getTime());
    const hours = Math.floor(diff / 1000 / 60 / 60);
    const minutes = Math.floor((diff / 1000 / 60) % 60);
    return `${hours} hours ${minutes} minutes`;
  };

  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e: any) => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    // Fetch data here
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const participants = await fetch(
          `${baseUrl}/api/contest/participants/${id}`
        );
        if (!participants.ok) {
          throw new Error("Failed to fetch participants");
        }

        const data = await participants.json();
        console.log(data);
        setParticipants(data.participants);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    if (!participants.length) return;

    let filteredParticipants = [...participants];
    if (searchTerm) {
      filteredParticipants = filteredParticipants.filter(
        (participant) =>
          participant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          participant.username.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    const total = Math.ceil(filteredParticipants.length / participantsPerPage);
    setTotalPages(total || 1);
    const validPage = Math.min(Math.max(1, currentPage), total || 1);
    if (validPage !== currentPage) {
      setCurrentPage(validPage);
    }

    const start = (validPage - 1) * participantsPerPage;
    const end = start + participantsPerPage;
    setDisplayedParticipants(filteredParticipants.slice(start, end));
  }, [participants, currentPage, participantsPerPage, searchTerm]);

  // Render medal for top 3
  const renderRankMedal = (rank: number) => {
    const baseRank = (currentPage - 1) * participantsPerPage + rank;

    if (baseRank === 1) {
      return <Medal className="h-5 w-5 text-yellow-400" />;
    } else if (baseRank === 2) {
      return <Medal className="h-5 w-5 text-gray-400" />;
    } else if (baseRank === 3) {
      return <Medal className="h-5 w-5 text-amber-700" />;
    }

    return null;
  };

  // Easter Egg with sarcastic quotes for the leaderboard
  const getEasterEggQuote = () => {
    const quotes = [
      "This leaderboard is truly a work of art 👏",
      "I'm sure the participants are just *so* happy with their ranks. Not like they're fighting for their lives or anything.",
      "Their hard work has truly paid off, haven't it?",
      "I bet they're thrilled to see their names on this list. Or not.",
      "Such a joy to witness the fruits of their labor.",
      "Inspiring to see the heights they've achieved.",
    ];
    return quotes[Math.floor(Math.random() * quotes.length)];
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-gray-900 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <Button variant="ghost" className="text-white mb-6" asChild>
          <a href={`/dashboard`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </a>
        </Button>

        <Card className="bg-white/10 backdrop-blur-md border-none text-white mb-6">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-blue-500/20 rounded-full">
                <Trophy className="w-10 h-10 text-blue-400" />
              </div>
            </div>

            <CardTitle className="text-2xl font-bold text-center">
              {name} - Leaderboard
            </CardTitle>
            <CardDescription className="text-center text-gray-300 text-sm ">
              Final rankings and scores for all participants <br />
              {/* Easter Egg Random quotes in quotes form */}
              <div className="mt-2 flex justify-center items-center space-x-1">
                {" "}
                <Quote className="h-6 w-6  text-blue-400" />{" "}
                <span className="italic">{getEasterEggQuote()}</span>
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-400">Date</p>
                  <p>{formatDate(startDate)}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Timer className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-400">Duration</p>
                  <p>{formatTimeDifference(startDate, endDate)}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-400">Participants</p>
                  <p>{countPart || 0}</p>
                </div>
              </div>
            </div>
            {/* Separator */}
            <div className="border-b border-gray-300 my-6"></div>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search participants..."
                    className="pl-10 bg-gray-800/50 border-gray-700"
                    value={searchTerm}
                    onChange={handleSearch}
                  />
                </div>
              </div>
            </div>
            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <>
                <div className="rounded-md border border-gray-700 overflow-hidden">
                  <Table>
                    <TableHeader className="bg-gray-800/50">
                      <TableRow>
                        <TableHead className="w-[60px] text-center">
                          Rank
                        </TableHead>
                        <TableHead>Participant</TableHead>
                        <TableHead className="text-center">Score</TableHead>
                        <TableHead className="hidden md:table-cell text-center">
                          Last Submission
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {displayedParticipants.map((participant, index) => {
                        const rank =
                          (currentPage - 1) * participantsPerPage + index + 1;
                        return (
                          <TableRow
                            key={participant.id}
                            className="hover:bg-gray-800/30 border-gray-700"
                          >
                            <TableCell className="font-medium text-center">
                              <div className="flex items-center justify-center">
                                <span className="mr-1">{rank}</span>
                                {renderRankMedal(index + 1)}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-3">
                                <Avatar>
                                  <AvatarImage
                                    src={participant.image}
                                    alt={participant.name}
                                  />
                                  <AvatarFallback>
                                    {participant.name
                                      .charAt(0)
                                      .toLocaleUpperCase()}
                                    {participant.name.split(" ")[1]
                                      ? participant.name
                                          .split(" ")[1]
                                          .charAt(0)
                                          .toLocaleUpperCase()
                                      : participant.name
                                          .charAt(1)
                                          .toLocaleUpperCase()}
                                  </AvatarFallback>
                                </Avatar>

                                <div>
                                  <div className="font-medium">
                                    {participant.name}
                                  </div>
                                  <div className="text-sm text-gray-400">
                                    @{participant.username}
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-center">
                              {participant.score}
                            </TableCell>
                            <TableCell className={`hidden md:table-cell ${participant.last_submission_at ? 'text-center' :'text-center'}`}>
                              {participant.last_submission_at ? (
                                new Date(
                                  participant.last_submission_at
                                ).toLocaleString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  hour: "numeric",
                                  minute: "numeric",
                                })
                              ) : (
                                <span className="text-gray-400 text-center ">
                                  N/A
                                </span>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
                {/* Pagination */}
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-gray-400">
                    Showing {(currentPage - 1) * participantsPerPage + 1} to{" "}
                    {Math.min(
                      currentPage * participantsPerPage,
                      participants.length
                    )}{" "}
                    of {participants.length} participants
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="border-gray-700"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      <span className="sr-only md:not-sr-only md:ml-2">
                        Previous
                      </span>
                    </Button>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;

                      if (totalPages <= 5) {
                        // Less than 5 pages, show all
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        // Near start, show first 5
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        // Near end, show last 5
                        pageNum = totalPages - 4 + i;
                      } else {
                        // In middle, show current and 2 on each side
                        pageNum = currentPage - 2 + i;
                      }
                      return (
                        <Button
                          key={pageNum}
                          variant={
                            currentPage === pageNum ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() => handlePageChange(pageNum)}
                          className={
                            currentPage !== pageNum ? "border-gray-700" : ""
                          }
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="border-gray-700"
                    >
                      <span className="sr-only md:not-sr-only md:mr-2">
                        Next
                      </span>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
