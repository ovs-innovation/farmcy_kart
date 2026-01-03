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
  Input,
  Select,
} from "@windmill/react-ui";
import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import useAsync from "@/hooks/useAsync";
import useFilter from "@/hooks/useFilter";
import PrescriptionServices from "@/services/PrescriptionServices";
import NotFound from "@/components/table/NotFound";
import PageTitle from "@/components/Typography/PageTitle";
import TableLoading from "@/components/preloader/TableLoading";
import PrescriptionTable from "@/components/prescription/PrescriptionTable";
import { SidebarContext } from "@/context/SidebarContext";
import { notifyError, notifySuccess } from "@/utils/toast";

const Prescriptions = () => {
  const { t } = useTranslation();
  const { lang, setIsUpdate } = useContext(SidebarContext);

  const { data, loading } = useAsync(PrescriptionServices.getAllPrescriptions);

  const prescriptionData = data?.prescriptions?.map((p) => ({
    ...p,
    name: { [lang]: p.user?.name || "Guest" },
    email: p.user?.email || "N/A",
    phone: p.user?.phone || "",
  }));

  const {
    userRef,
    setStatus,
    status,
    handleChangePage,
    totalResults,
    resultsPerPage,
    dataTable,
    serviceData,
    handleSubmitUser,
    setSearchUser,
  } = useFilter(prescriptionData);

  const handleResetField = () => {
    setStatus("");
    setSearchUser("");
    userRef.current.value = "";
  };

  const handleDelete = (id) => {
    PrescriptionServices.deletePrescription(id)
      .then((res) => {
        setIsUpdate(true);
        notifySuccess(res.message);
      })
      .catch((err) => notifyError(err.message));
  };

  return (
    <>
      <PageTitle>{t("Prescriptions")}</PageTitle>

      <Card className="min-w-0 shadow-xs overflow-hidden bg-white dark:bg-gray-800 mb-5">
        <CardBody>
          <form
            onSubmit={handleSubmitUser}
            className="py-3 grid gap-4 lg:gap-6 xl:gap-6 md:flex xl:flex"
          >
            <div className="flex-grow-0 md:flex-grow lg:flex-grow xl:flex-grow">
              <Input
                ref={userRef}
                type="search"
                name="search"
                placeholder="Search by Customer Name/Email/Phone"
              />
              <button
                type="submit"
                className="absolute right-0 top-0 mt-5 mr-1"
              ></button>
            </div>
            <div className="flex-grow-0 md:flex-grow lg:flex-grow xl:flex-grow">
              <Select
                onChange={(e) => setStatus(e.target.value)}
                className="h-12"
                value={status}
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="processed">Approved</option>
                <option value="rejected">Rejected</option>
              </Select>
            </div>
            <div className="flex items-center gap-2 flex-grow-0 md:flex-grow lg:flex-grow xl:flex-grow">
              <div className="w-full mx-1">
                <Button type="submit" className="h-12 w-full bg-store-700">
                  Filter
                </Button>
              </div>

              <div className="w-full mx-1">
                <Button
                  layout="outline"
                  onClick={handleResetField}
                  type="reset"
                  className="px-4 md:py-1 py-2 h-12 text-sm dark:bg-gray-700"
                >
                  <span className="text-black dark:text-gray-200">Reset</span>
                </Button>
              </div>
            </div>
          </form>
        </CardBody>
      </Card>

      {loading ? (
        <TableLoading row={5} col={6} />
      ) : serviceData?.length !== 0 ? (
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
            <PrescriptionTable prescriptions={dataTable} handleDelete={handleDelete} />
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
        <NotFound title="Sorry, There are no prescriptions right now." />
      )}
    </>
  );
};

export default Prescriptions;
