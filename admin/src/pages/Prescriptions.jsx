import {
  Card,
  CardBody,
  Table,
  TableCell,
  TableContainer,
  TableFooter,
  TableHeader,
  Pagination,
  Button,
} from "@windmill/react-ui";
import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import useAsync from "@/hooks/useAsync";
import PrescriptionServices from "@/services/PrescriptionServices";
import NotFound from "@/components/table/NotFound";
import PageTitle from "@/components/Typography/PageTitle";
import TableLoading from "@/components/preloader/TableLoading";
import PrescriptionTable from "@/components/prescription/PrescriptionTable";

const Prescriptions = () => {
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const [status, setStatus] = useState("");

  const { data, loading } = useAsync(PrescriptionServices.getAllPrescriptions);

  const filteredData = data?.prescriptions?.filter((p) =>
    status ? p.status === status : true
  );

  const totalResults = filteredData?.length || 0;
  const resultsPerPage = 8;

  const handleChangePage = (p) => {
    setCurrentPage(p);
  };

  const paginatedData = filteredData?.slice(
    (currentPage - 1) * resultsPerPage,
    currentPage * resultsPerPage
  );

  return (
    <>
      <PageTitle>{t("Prescriptions")}</PageTitle>
      <Card className="min-w-0 shadow-xs overflow-hidden bg-white dark:bg-gray-800 mb-5">
        <CardBody>
          <div className="flex gap-4">
            <Button
              layout={status === "" ? "primary" : "outline"}
              style={status === "" ? { backgroundColor: "#10b981", borderColor: "#10b981" } : {}}
              onClick={() => setStatus("")}
            >
              All
            </Button>
            <Button
              layout={status === "pending" ? "primary" : "outline"}
              style={status === "pending" ? { backgroundColor: "#10b981", borderColor: "#10b981" } : {}}
              onClick={() => setStatus("pending")}
            >
              Pending
            </Button>
            <Button
              layout={status === "processed" ? "primary" : "outline"}
              style={status === "processed" ? { backgroundColor: "#10b981", borderColor: "#10b981" } : {}}
              onClick={() => setStatus("processed")}
            >
              Approved
            </Button>
            <Button
              layout={status === "rejected" ? "primary" : "outline"}
              style={status === "rejected" ? { backgroundColor: "#10b981", borderColor: "#10b981" } : {}}
              onClick={() => setStatus("rejected")}
            >
              Rejected
            </Button>
          </div>
        </CardBody>
      </Card>

      {loading ? (
        <TableLoading row={5} col={6} />
      ) : filteredData?.length !== 0 ? (
        <TableContainer className="mb-8">
          <Table>
            <TableHeader>
              <tr>
                <TableCell>ID</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Customer Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell className="text-center">Status</TableCell>
                <TableCell className="text-right">Actions</TableCell>
              </tr>
            </TableHeader>
            <PrescriptionTable prescriptions={paginatedData} />
          </Table>
          <TableFooter>
            <Pagination
              totalResults={totalResults}
              resultsPerPage={resultsPerPage}
              onChange={handleChangePage}
              label="Table navigation"
            />
          </TableFooter>
        </TableContainer>
      ) : (
        <NotFound title="Prescription" />
      )}
    </>
  );
};

export default Prescriptions;
