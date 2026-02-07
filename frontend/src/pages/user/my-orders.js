import { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { IoBagHandle } from "react-icons/io5";
import ReactPaginate from "react-paginate";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { setToken } from "@services/httpServices";

//internal import
import Dashboard from "@pages/user/dashboard";
import useGetSetting from "@hooks/useGetSetting";
import OrderServices from "@services/OrderServices";
import Loading from "@components/preloader/Loading";
import useUtilsFunction from "@hooks/useUtilsFunction";
import OrderHistory from "@components/order/OrderHistory";
import ReviewModal from "@components/reviews/ReviewModal";
import { SidebarContext } from "@context/SidebarContext";
import CMSkeletonTwo from "@components/preloader/CMSkeletonTwo";

const MyOrders = () => {
  const { data: session, status } = useSession();
  const { currentPage, handleChangePage, isLoading, setIsLoading } =
    useContext(SidebarContext);

  const { storeCustomizationSetting } = useGetSetting();
  const { showingTranslateValue } = useUtilsFunction();
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedProductForReview, setSelectedProductForReview] = useState(null);

  // Support fetching orders when the user is logged in via cookie (synchronous)
  // (sometimes next-auth session may be unauthenticated while cookie exists)
  const userInfoCookie = Cookies.get("userInfo");
  const parsedUser = userInfoCookie ? JSON.parse(userInfoCookie) : null;
  const userId = session?.user?.id || parsedUser?._id || parsedUser?.id || null;
  const hasAuthToken = !!(session?.user?.token || parsedUser?.token);
  const isClientLoggedIn = status === "authenticated" || !!parsedUser;

  // ensure axios has Authorization header if we have token in cookie
  useEffect(() => {
    if (parsedUser?.token && !session?.user?.token) {
      setToken(parsedUser.token);
    }
  }, [parsedUser?.token, session?.user?.token]);

  const {
    data,
    error,
    isLoading: loading,
  } = useQuery({
    queryKey: ["orders", { currentPage, user: userId }],
    queryFn: async () =>
      await OrderServices.getOrderCustomer({
        limit: 10,
        page: currentPage,
      }),
    enabled: hasAuthToken && isClientLoggedIn,
  });

  const pageCount = Math.ceil(data?.totalDoc / 8);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  // console.log("data?.orders?.length", data?.totalDoc);
  return (
    <>
      {isLoading ? (
        <Loading loading={isLoading} />
      ) : (
        <Dashboard
          title={showingTranslateValue(
            storeCustomizationSetting?.dashboard?.my_order
          )}
          description="This is user order history page"
        >
          <div className="overflow-hidden rounded-md font-serif">
            <div className="flex flex-col">
              <h2 className="text-xl font-serif font-semibold mb-5">
                My Orders
              </h2>
              <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="align-middle inline-block border border-gray-100 rounded-md min-w-full pb-2 sm:px-6 lg:px-8">
                  <div className="overflow-hidden border-b last:border-b-0 border-gray-100 rounded-md">
                    {loading ? (
                      <CMSkeletonTwo
                        count={20}
                        width={100}
                        error={error}
                        loading={loading}
                      />
                    ) : data?.orders?.length === 0 ? (
                      <div className="text-center">
                        <span className={`flex justify-center my-30 pt-0 text-store-500 font-semibold text-6xl`}>
                          <IoBagHandle />
                        </span>
                        <h2 className="font-medium text-md my-4 text-gray-600">
                          You Have no order Yet!
                        </h2>
                      </div>
                    ) : (
                      <table className="table-auto min-w-full border border-gray-100 divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr className="bg-gray-100">
                            <th
                              scope="col"
                              className="text-left text-xs font-serif font-semibold px-6 py-2 text-gray-700 uppercase tracking-wider"
                            >
                              ID
                            </th>
                            <th
                              scope="col"
                              className="text-center text-xs font-serif font-semibold px-6 py-2 text-gray-700 uppercase tracking-wider"
                            >
                              OrderTime
                            </th>

                            <th
                              scope="col"
                              className="text-center text-xs font-serif font-semibold px-6 py-2 text-gray-700 uppercase tracking-wider"
                            >
                              Method
                            </th>
                            <th
                              scope="col"
                              className="text-center text-xs font-serif font-semibold px-6 py-2 text-gray-700 uppercase tracking-wider"
                            >
                              Status
                            </th>
                            <th
                              scope="col"
                              className="text-center text-xs font-serif font-semibold px-6 py-2 text-gray-700 uppercase tracking-wider"
                            >
                              Total
                            </th>
                            <th
                              scope="col"
                              className="text-right text-xs font-serif font-semibold px-6 py-2 text-gray-700 uppercase tracking-wider"
                            >
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {data?.orders?.map((order) => (
                            <tr key={order._id}>
                              <OrderHistory order={order} />
                              <td className="px-5 py-3 whitespace-nowrap text-right text-sm">
                                <div className="flex justify-end gap-2">
                                  <Link
                                    className={`px-3 py-1 bg-store-100 text-xs text-store-600 hover:bg-store-500 hover:text-white transition-all font-semibold rounded-full`}
                                    href={`/order/${order._id}`}
                                  >
                                    Details
                                  </Link>
                                  {order.status === "Delivered" &&
                                    order?.cart &&
                                    Array.isArray(order.cart) &&
                                    order.cart[0]?.slug && (
                                      <button
                                        type="button"
                                        className="px-3 py-1 bg-blue-50 text-xs text-blue-600 hover:bg-blue-500 hover:text-white transition-all font-semibold rounded-full"
                                        onClick={() => {
                                          setSelectedProductForReview(order.cart[0]);
                                          setReviewModalOpen(true);
                                        }}
                                      >
                                        Rate &amp; Review
                                      </button>
                                    )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                    {data?.totalDoc > 10 && (
                      <div className="paginationOrder">
                        <ReactPaginate
                          breakLabel="..."
                          nextLabel="Next"
                          onPageChange={(e) => handleChangePage(e.selected + 1)}
                          pageRangeDisplayed={3}
                          pageCount={pageCount}
                          previousLabel="Previous"
                          renderOnZeroPageCount={null}
                          pageClassName="page--item"
                          pageLinkClassName="page--link"
                          previousClassName="page-item"
                          previousLinkClassName="page-previous-link"
                          nextClassName="page-item"
                          nextLinkClassName="page-next-link"
                          breakClassName="page--item"
                          breakLinkClassName="page--link"
                          containerClassName="pagination"
                          activeClassName="activePagination"
                          forcePage={currentPage - 1} // Sync UI with currentPage
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {reviewModalOpen && selectedProductForReview && (
            <ReviewModal
              open={reviewModalOpen}
              onClose={() => setReviewModalOpen(false)}
              productSnapshot={selectedProductForReview}
            />
          )}
        </Dashboard>
      )}
    </>
  );
};

export default MyOrders;
