import {
  Ban,
  Check,
  ChevronLeft,
  CircleOff,
  CircleX,
  Cross,
  Gavel,
  MoveLeft,
  RefreshCcw,
  RotateCcw,
  Search,
} from "lucide-react";
import { Button } from "../ui/button";
import { Toaster } from "../ui/toaster";
import Nav from "./nav";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Label } from "@radix-ui/react-label";
import { Input } from "../ui/input";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { useToast } from "@/hooks/use-toast";

export default function ManageContestUserPage({
  props,
  baseUrl,
  id,
}: {
  props: any;
  baseUrl: string;
  id: string;
}) {
  const { name, email, image, username, isAdmin } = props.data;
  const [isLoading, setIsLoading] = useState(false);
  const [participants, setParticipants] = useState<any[]>([]);

  const { toast } = useToast();
  useEffect(() => {
    refresh();
  }, []);

  const [search, setSearch] = useState("");
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const enableUserTest = (userId: string) => {
    setIsLoading(true);
    console.log(userId, id);
    fetch(`${baseUrl}/api/admin/enableUserTest`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        userId: userId,
        contestId: id,
      }),
    })
      .then(async (res) => {
        const data = await res.json();

        if (res.ok) {
          toast({
            title: "User Test Enabled",
            description: "User test enabled successfully",
            variant: "default",
            duration: 5000,
          });
          refresh();
        } else {
          toast({
            title: "Error",
            description: data.message,
            variant: "destructive",
          });
        }
      })
      .catch((err) =>
        toast({ title: "Error", description: err, variant: "destructive" })
      );
    setIsLoading(false);
  };

  const refresh = () => {
    setIsLoading(true);
    setSearch("");
    fetch(`${baseUrl}/api/admin/contestParticipants`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        contestId: id,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        toast({
          title: "Refreshed",
          description: "Contest participants refreshed successfully",
          variant: "default",
          duration: 5000,
        });
        setParticipants(data.participants);
      })
      .catch((err) =>
        toast({ title: "Error", description: err, variant: "destructive" })
      );
    setIsLoading(false);
  };

  return (
    <>
      <Toaster />
      <Nav
        name={name}
        email={email}
        image={image}
        username={username}
        isAdmin={isAdmin}
      />
      <div className="flex flex-col px-4 py-24">
        <div className="flex items-center mb-6 space-x-2">
          <Button
            variant="outline"
            className="flex items-center"
            onClick={() => (window.location.href = "/admin/manageContests")}
          >
            <MoveLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold">Contest's User Management</h1>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Contest User Management</CardTitle>
            <CardDescription>
              View, edit, and manage coding contests user
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Label htmlFor="search-contests">Search Users</Label>
              <div className="flex items-center space-x-2 mt-2">
                <Search className="h-6 w-6 text-muted-foreground" />
                <Input
                  id="search-contests"
                  placeholder="Search by username"
                  value={search}
                  onChange={handleSearch}
                />
                <Button onClick={refresh}>
                  <RefreshCcw className="h-6 w-6" />
                </Button>
              </div>
            </div>
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>S.No</TableHead>
                    <TableHead>Participant</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead className="text-center">Joined</TableHead>
                    <TableHead className="text-center">Disqualified</TableHead>
                    <TableHead className="text-center">Score</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {participants.map((participant, index) => (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        <div className="flex flex-col items-start">
                          <p>{participant.name}</p>
                          <p>~ {participant.username}</p>
                        </div>
                      </TableCell>
                      <TableCell>{participant.email}</TableCell>
                      <TableCell>
                        {!participant.isFirstTime ? (
                          <div className="flex items-center justify-center space-x-2">
                            <Check className="h-4 w-4 text-green-500" />
                            <p className="text-green-500">Yes </p>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center space-x-2">
                            <CircleX className="h-4 w-4 text-red-500" />
                            <p className="text-red-500">No </p>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        {participant.isDisqualified ? (
                          <div className="flex items-center justify-center space-x-2">
                            <Check className="h-4 w-4 text-red-500" />
                            <p className="text-red-500">Yes </p>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center space-x-2">
                            <CircleX className="h-4 w-4 text-green-500" />
                            <p className="text-green-500">No </p>
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        {participant.score}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center  space-x-2">
                          {/* isDisqualified */}
                          <Button size="sm" variant="destructive">
                            <Ban className="h-4 w-4" />
                            Ban
                          </Button>

                          {/* Renable Test */}
                          <Button
                            onClick={() => {
                              enableUserTest(participant.id);
                            }}
                            size="sm"
                            variant="default"
                          >
                            <RotateCcw className="h-4 w-4" />
                            Allow
                          </Button>

                          {/* Unban */}
                          <Button size="sm" variant="default">
                            <CircleOff className="h-4 w-4" />
                            Unban
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
