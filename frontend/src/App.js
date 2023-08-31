
import './App.css';
import { login,reqProjected,refreshToken } from './api';

function App() {
  return (
    <div className="App">
      <button onClick={()=>{
        login().then(res=>{
          console.log('登录成功')
        })
      }}>登录</button>
      <button onClick={()=>{
        reqProjected().then(res=>{
          console.log('获取受保护资源')
        }).catch(err=>{

        })
      }}>请求受保护的资源</button>
      <button onClick={()=>{
        refreshToken().then(res=>{
          console.log('刷新token成功')
        }).catch(err=>{

        })
      }}>刷新token</button>
    </div>
  );
}

export default App;
