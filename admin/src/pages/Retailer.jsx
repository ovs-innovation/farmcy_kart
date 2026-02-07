import { Card, CardBody, Input, Pagination, Table, TableContainer, TableFooter, TableHeader, TableCell, Select } from "@windmill/react-ui";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

import WholesalerTable from "@/components/wholesaler/WholesalerTable";
import TableLoading from "@/components/preloader/TableLoading";
import NotFound from "@/components/table/NotFound";
import PageTitle from "@/components/Typography/PageTitle";
import useFilter from "@/hooks/useFilter";
import CustomerServices from "@/services/CustomerServices";
import AnimatedContent from "@/components/common/AnimatedContent";
import MainDrawer from "@/components/drawer/MainDrawer";
import WholesalerDrawer from "@/components/drawer/WholesalerDrawer";
import { useContext } from "react";
import { SidebarContext } from "@/context/SidebarContext";

const Retailer = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { toggleDrawer } = useContext(SidebarContext);

  useEffect(() => {
    const fetchWholesalers = async () => {
      setLoading(true);
      try {
        const res = await CustomerServices.getAllWholesalers();
        setData(res);
      } catch (err) {
        setError(err.message || "Failed to fetch wholesalers");
      } finally {
        setLoading(false);
      }
    };

    fetchWholesalers();
  }, []);

  const { userRef, dataTable, serviceData, filename, isDisabled, setSearchUser, totalResults, resultsPerPage, handleSubmitUser, handleSelectFile, handleChangePage, handleUploadMultiple, handleRemoveSelectFile } = useFilter(data);

  const { t } = useTranslation();

  const handleResetField = () => {
    setSearchUser("");
    userRef.current.value = "";
  };

  return (
    <>
      <PageTitle>Retailers</PageTitle>

      <AnimatedContent>
        <Card className="min-w-0 shadow-xs overflow-hidden bg-white dark:bg-gray-800 mb-5">
          <CardBody>
            <form onSubmit={handleSubmitUser} className="py-3 grid gap-4 lg:gap-6 xl:gap-6 md:flex xl:flex">
              <div className="flex-grow-0 md:flex-grow lg:flex-grow xl:flex-grow">
                <Input ref={userRef} type="search" name="search" placeholder={t("CustomersPageSearchPlaceholder")} />
              </div>

              <div className="flex items-center gap-2 flex-grow-0 md:flex-grow lg:flex-grow xl:flex-grow">
                <div className="w-full mx-1">
                  <button className="h-12 w-full bg-store-700 text-white rounded px-4 py-2" type="submit">Filter</button>
                </div>

                <div className="w-full mx-1">
                  <button onClick={handleResetField} type="button" className="px-4 md:py-1 py-2 h-12 text-sm dark:bg-gray-700 rounded">Reset</button>
                </div>
              </div>
            </form>
          </CardBody>
        </Card>

        <div className="flex justify-end mb-4">
          <button
            onClick={() => toggleDrawer()}
            className="bg-store-700 text-white px-4 py-2 rounded"
          >
            Add Retailer
          </button>
        </div>

        <MainDrawer>
          <WholesalerDrawer />
        </MainDrawer>
      </AnimatedContent>

      {loading ? (
        <TableLoading row={12} col={8} width={220} height={20} />
      ) : error ? (
        <span className="text-center mx-auto text-red-500">{error}</span>
      ) : serviceData?.length !== 0 ? (
        <TableContainer className="mb-8 overflow-x-scroll w-full custom-scrollbar">
          <Table className="w-full">
            <TableHeader>
              <tr>
                <TableCell>ID</TableCell>
                <TableCell>Joining Date</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Aadhar</TableCell>
                <TableCell>PAN</TableCell>
                <TableCell>GST</TableCell>
                <TableCell>Drug License</TableCell>
                <TableCell className="text-right">Actions</TableCell>
              </tr>
            </TableHeader>
            <WholesalerTable wholesalers={dataTable} />
          </Table>
          <TableFooter>
            <Pagination totalResults={totalResults} resultsPerPage={resultsPerPage} onChange={handleChangePage} label="Table navigation" />
          </TableFooter>
        </TableContainer>
      ) : (
        <NotFound title="Sorry, There are no wholesalers right now." />
      )}
    </>
  );
};

export default Retailer;
