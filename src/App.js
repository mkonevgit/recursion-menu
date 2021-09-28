import './App.css';
import jsonData from './tree.json';
import {nanoid} from 'nanoid';
import {useState, useEffect} from 'react';
import cloneDeep from 'lodash/cloneDeep';



function App() {

  const [data, setData] = useState(jsonData);

  let tree;

  let n = 1;

  tree = clothesRecursion(nanoid(8), "obj", data.data[0]);

  function toggleParent(id) {
    setData((prevData) => {
      function toggleLeavesRecursion(elemType, elem, id) {
        let localParentElem;
        switch (elemType) {
          case "obj":
            for (let key in elem) {
              if (typeof elem[key] === "object" && Array.isArray(elem[key])) {
                localParentElem = toggleLeavesRecursion("arr", elem[key], id);
              } else if (typeof elem[key] === "object") {
                localParentElem = toggleLeavesRecursion("obj", elem[key], id);
              } else {
                if (key === 'id' && elem['id'] === id) {
                  elem['isActive'] = !elem['isActive'];
                }
              }
            }
            break;
          case "arr":
            for (let key of elem) {
              if (typeof key === "object") {
                localParentElem = toggleLeavesRecursion("obj", key, id);
              }
            }
            break;
        }
      }
      function deepClone(obj) {
        const clObj = {};
        for(const i in obj) {
          if (obj[i] instanceof Object) {
            clObj[i] = deepClone(obj[i]);
            continue;
          }
          clObj[i] = obj[i];
        }
        return clObj;
      }
      // const prevDataCopy = deepClone(prevData);
      // deepClone не работает, клонирование неточное
      // повторный проход функции clothesRecursion на клонированном объекте вызывает ошибки
      // const prevDataCopy = JSON.parse(JSON.stringify(prevData));
      // JSON работает, повторный проход функции clothesRecursion на клонированном объекте ошибок не вызывает
      const prevDataCopy = cloneDeep(prevData); //функция cloneDeep библиотеки lodash работает
      // повторный проход функции clothesRecursion на клонированном объекте ошибок не вызывает
      toggleLeavesRecursion('obj', prevDataCopy.data[0], id);
      console.log(prevDataCopy);
      return prevDataCopy;
    });
  }



  function clothesRecursion(parentID, elemType, elem) {

    let localParentElem;
    const localParentElemArr = [];

    switch (elemType) {
      case "obj":
        for (let key in elem) {
          if (typeof elem[key] === "object" && Array.isArray(elem[key])) {
            localParentElem = clothesRecursion(nanoid(8), "arr", elem[key]);
            if (localParentElem !== null) localParentElemArr.push(localParentElem);
          } else if ((typeof elem[key] === "object") && !Array.isArray(elem[key])) {
            localParentElem = clothesRecursion(nanoid(8), "obj", elem[key]);
            if (localParentElem !== null) localParentElemArr.push(localParentElem);
          } else if (key === 'name') {
            if (elem['subCategories'].length === 0) {
              localParentElemArr.push(<div key={elem['id']} className={"primitive"}>{elem[key]}</div>);
            }
          }
        }
        break;
      case "arr":
        for (let key of elem) {
          if (typeof key === "object") {
            localParentElem = clothesRecursion(nanoid(8), "obj", key);
            if (localParentElem !== null) localParentElemArr.push(localParentElem);
          }
        }
        break;
    }

    let parentElem;

    if (localParentElemArr.length > 0) {
      if (elem && typeof elem === "object" && !Array.isArray(elem) && elem['subCategories'].length > 0) {
        parentElem =
         <div id={elem['id']} key={elem['id']} className={"inside_div"}>
           <div>
             <div className={"primitive_span"}>
               <button className={"plus_button"} value={elem['id']} onClick={(event) => toggleParent(event.target.value)}>
                 {elem['isActive'] ? '-' : '+'}
               </button>
               <b><span >{' '+elem['name']}</span></b>
             </div>
           </div>
          <div>
            {elem['isActive'] ? localParentElemArr : null}
          </div>
        </div>;

      } else {
        parentElem = <div id={elem['id']} key={nanoid(8)} className={"inside_div"}>
          {localParentElemArr}
        </div>;
      }
      return parentElem;
    }
    else return null;
  }
  return (
    <div className="App">
      {tree}
    </div>
  );
}

export default App;
