import Header from './Header';
import Main from './Main';
// import { Badge } from './ui/badge';

export function Dashboard() {
  return (
    <>
      <div className="flex min-h-screen w-full flex-col">
        <Header />
        <Main />
      </div>
    </>
  );
}
