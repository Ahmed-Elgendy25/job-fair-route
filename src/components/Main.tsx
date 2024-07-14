import Records from './Records';
import ChartComponent from './ChartComponent';
import Transactions from './Transactions';

// import Sales from './Sales';
/* API-GET-FUNCTIONS */

function Main() {
  return (
    <main className="flex flex-1 flex-col  gap-4 p-4 md:gap-8 md:p-8">
      <Records />
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        <Transactions />
        <ChartComponent />
      </div>
    </main>
  );
}

export default Main;
