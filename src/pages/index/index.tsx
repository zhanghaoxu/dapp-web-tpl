import { queryUserInfo } from '@/services/api';
import { useRequest } from 'ahooks';
import { useState } from 'react';
export default function HomePage() {
  const [query, setQuery] = useState({ number: 0 });

  const { data, loading, error, run } = useRequest(queryUserInfo, { manual: true });
  console.log(data, error);
  if (loading) {
    return 'loading';
  } else {
    return (
      <div>
        <h2>Yay! Welcome !</h2>
        <button
          onClick={() => {
            run();
          }}
        >
          手动请求一次
        </button>
        <button
          onClick={() => {
            setQuery({ number: query.number + 1 });
          }}
        >
          修改数字{query.number}
        </button>
      </div>
    );
  }
}
