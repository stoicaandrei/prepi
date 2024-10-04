import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ClipboardList } from "lucide-react";
import { trpc } from "@/utils/trpc";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const PracticeHistoryCard = () => {
  const { data: practiceHistory, isLoading: practiceHistoryLoading } =
    trpc.practice.listPracticeHistory.useQuery();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold">
          <ClipboardList className="mr-2 h-6 w-6 inline-block text-cyan-500" />
          Ultimele teste
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">CAPITOL</TableHead>
              <TableHead className="text-right">PUNCTE</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {practiceHistory?.map((practice) => (
              <TableRow key={practice.id}>
                <TableCell className="font-medium">
                  {practice.subject.name}
                </TableCell>
                <TableCell className="text-right">+ {practice.score}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {!practiceHistory?.length && (
          <p className="text-sm text-muted-foreground text-center mt-4">
            Nu ai făcut teste încă!
          </p>
        )}
      </CardContent>
    </Card>
  );
};
