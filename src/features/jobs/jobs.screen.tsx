import { JobsTable } from "./table";
import { PaginationButtons, usePagination } from "../../shared";
import { useEmptyStateContent, useFetchJobs, useLoadingStateContent } from "./hooks";
import { useCallback, useEffect, useState } from "react";
import { InputDashboard } from "./input-dashboard";
import type { Job } from "./types";
import { DisplayJobModal } from "./components";

export const JobsScreen = () => {
  const [region, setRegion] = useState(3);
  const [title, setTitle] = useState("software");
  const [published, setPublished] = useState("3");
  const [triggerDisplayJob, setTriggerDisplayJob] = useState(false);
  const [jobId, setJobId] = useState<number | undefined>(undefined);
  const [selectedJob, setSelectedJob] = useState<Job | undefined>(undefined);

  const { data: jobs, isFetching, isFetched, fetchData} = useFetchJobs(region, title, published);
  const { data: jobsList, nextPageHandler, previousPageHandler, currentPage, lastPage } = usePagination(jobs, 10);

  useEffect(() => {
    const job = jobs.find(item => item.id === jobId)

    setSelectedJob(job);
  }, [jobId])

  const isLoadingFirstTime = !isFetched && isFetching;
  const isLoadedAndHasData = isFetched && jobsList.length > 0;
  const isLoadedAndHasNoData = isFetched && jobsList.length === 0;

  const emptyStateContent = useEmptyStateContent(isLoadedAndHasNoData);
  const loadingStateContent = useLoadingStateContent(isLoadingFirstTime);

  const handleCloseDisplayJob = useCallback(() =>
    setTriggerDisplayJob(false), []);

  const handleDisplayJob = useCallback(() =>
    setTriggerDisplayJob(true), []);

  const handleSelectJob = (id: number) => {
    setJobId(id);
  }

  return (
    <>
      {triggerDisplayJob && <DisplayJobModal selectedJob={selectedJob} closeModal={handleCloseDisplayJob} />}
      <InputDashboard 
        region={region} 
        selectRegion={setRegion}
        title={title}
        setTitle={setTitle}
        published={published}
        setPublished={setPublished}
        fetchData={fetchData}
      />
      <>
        {emptyStateContent}
        {loadingStateContent}

        {isLoadedAndHasData && (
          <>
            <JobsTable 
              jobsList={jobsList} 
              displayJob={handleDisplayJob} 
              selectJob={handleSelectJob}
            />
            <PaginationButtons 
              previousPageHandler={previousPageHandler} 
              nextPageHandler={nextPageHandler}
              currentPage={currentPage}
              lastPage={lastPage} />
          </>
        )}
      </>
    </>
  );
}
