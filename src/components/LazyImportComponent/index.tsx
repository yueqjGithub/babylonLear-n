import { LazyExoticComponent, Suspense } from "react";

const LazyImportComponent = (props: {
  lazyChildren: LazyExoticComponent<() => JSX.Element>;
}) => {
  return (
    <Suspense fallback={<>Loading...</>}>
      <props.lazyChildren />
    </Suspense>
  );
}

export default LazyImportComponent
