import {
  Button,
  Card,
  CardBody,
  Input,
  Pagination,
  Table,
  TableCell,
  TableContainer,
  TableFooter,
  TableHeader,
} from "@windmill/react-ui";
import { useContext, useState } from "react";
import { FiEdit, FiPlus, FiSearch, FiTrash2 } from "react-icons/fi";
import { useTranslation } from "react-i18next";

//internal import
import { SidebarContext } from "@/context/SidebarContext";
import CouponServices from "@/services/CouponServices";
import useAsync from "@/hooks/useAsync";
import useToggleDrawer from "@/hooks/useToggleDrawer";
import useFilter from "@/hooks/useFilter";
import PageTitle from "@/components/Typography/PageTitle";
import DeleteModal from "@/components/modal/DeleteModal";
import BulkActionDrawer from "@/components/drawer/BulkActionDrawer";
import MainDrawer from "@/components/drawer/MainDrawer";
import CouponDrawer from "@/components/drawer/CouponDrawer";
import TableLoading from "@/components/preloader/TableLoading";
import CheckBox from "@/components/form/others/CheckBox";
import CouponTable from "@/components/coupon/CouponTable";
import NotFound from "@/components/table/NotFound";
import UploadMany from "@/components/common/UploadMany";
import AnimatedContent from "@/components/common/AnimatedContent";
import AddCouponForm from "@/components/coupon/AddCouponForm";
import useCouponSubmit from "@/hooks/useCouponSubmit";
import { FiDownload } from "react-icons/fi";

const Coupons = () => {
  const { t } = useTranslation();
  const { toggleDrawer, lang } = useContext(SidebarContext);
  const { data, loading, error } = useAsync(CouponServices.getAllCoupons);
  const [isCheckAll, setIsCheckAll] = useState(false);
  const [isCheck, setIsCheck] = useState([]);

  const { allId, serviceId, handleDeleteMany, handleUpdateMany } =
    useToggleDrawer();

  const {
    register,
    handleSubmit,
    onSubmit,
    errors,
    setImageUrl,
    imageUrl,
    published,
    setPublished,
    currency,
    discountType,
    setDiscountType,
    isSubmitting,
    handleSelectLanguage,
    setValue,
    reset,
  } = useCouponSubmit(serviceId);

  const {
    filename,
    isDisabled,
    couponRef,
    dataTable,
    serviceData,
    totalResults,
    resultsPerPage,
    handleChangePage,
    handleSelectFile,
    setSearchCoupon,
    handleSubmitCoupon,
    handleUploadMultiple,
    handleRemoveSelectFile,
  } = useFilter(data);

  const handleSelectAll = () => {
    setIsCheckAll(!isCheckAll);
    setIsCheck(data?.map((li) => li._id));
    if (isCheckAll) {
      setIsCheck([]);
    }
  };

  // handle reset field function
  const handleResetField = () => {
    setSearchCoupon("");
    couponRef.current.value = "";
  };

  return (
    <>
      <PageTitle>{t("CouponspageTitle")}</PageTitle>
      <DeleteModal
        ids={allId}
        setIsCheck={setIsCheck}
        title="Selected Coupon"
      />
      <BulkActionDrawer ids={allId} title="Coupons" />

      <MainDrawer>
        <CouponDrawer id={serviceId} />
      </MainDrawer>

      <AnimatedContent>
        {/* Add Coupon Form Section */}
        <AddCouponForm
          register={register}
          handleSubmit={handleSubmit}
          onSubmit={onSubmit}
          errors={errors}
          setImageUrl={setImageUrl}
          imageUrl={imageUrl}
          published={published}
          setPublished={setPublished}
          currency={currency}
          discountType={discountType}
          setDiscountType={setDiscountType}
          isSubmitting={isSubmitting}
          handleSelectLanguage={handleSelectLanguage}
          setValue={setValue}
          reset={reset}
          id={serviceId}
        />

        {/* Search and Export Section */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm mb-6 border border-gray-100 dark:border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold">Coupon List</h3>
              <span className="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded text-sm text-gray-500 font-medium">
                {totalResults}
              </span>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative w-full max-w-md">
                <Input
                  type="text"
                  placeholder="Search by invoice or name..."
                  className="w-full h-12 pl-5 pr-14 rounded-full border border-gray-300 bg-white text-sm placeholder-gray-400 focus:border-teal-400 focus:ring-0"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-1 flex items-center text-[#8fc3c9] hover:text-teal-600"
                >
                  <FiSearch className="text-2xl" />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  onClick={() => handleUpdateMany(isCheck)}
                  disabled={isCheck.length < 1}
                  layout="outline"
                  className="h-10 px-4 border-gray-200 text-gray-600 flex items-center gap-2"
                >
                  <FiDownload className="text-sm" />
                  Bulk Action
                </Button>

                <UploadMany
                  title="Coupon"
                  exportData={data}
                  filename={filename}
                  isDisabled={isDisabled}
                  handleSelectFile={handleSelectFile}
                  handleUploadMultiple={handleUploadMultiple}
                  handleRemoveSelectFile={handleRemoveSelectFile}
                />
              </div>
            </div>
          </div>
        </div>
      </AnimatedContent>

      {loading ? (
        <TableLoading row={12} col={8} width={140} height={20} />
      ) : error ? (
        <span className="text-center mx-auto text-red-500">{error}</span>
      ) : serviceData?.length !== 0 ? (
        <TableContainer className="mb-8 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
          <Table>
            <TableHeader className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <TableCell>
                  <CheckBox
                    type="checkbox"
                    name="selectAll"
                    id="selectAll"
                    handleClick={handleSelectAll}
                    isChecked={isCheckAll}
                  />
                </TableCell>
                <TableCell>SI</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Code</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Total Uses</TableCell>
                <TableCell>Min Purchase</TableCell>
                <TableCell>Max Discount</TableCell>
                <TableCell>Discount</TableCell>
                <TableCell>Discount Type</TableCell>
                <TableCell>Start Date</TableCell>
                <TableCell>Expire Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell className="text-right">Action</TableCell>
              </tr>
            </TableHeader>
            <CouponTable
              lang={lang}
              isCheck={isCheck}
              coupons={dataTable}
              setIsCheck={setIsCheck}
            />
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
        <NotFound title="Sorry, There are no coupons right now." />
      )}
    </>
  );
};

export default Coupons;
