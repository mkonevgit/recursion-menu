import './Tree.css';
import {nanoid} from 'nanoid';
import {useState, useEffect} from 'react';

function Tree({data}) {

   let tree;

   tree = clothesRecursion(nanoid(8),"obj", data.data[0]);

   function clothesRecursion(parentID, elemType, elem) {
      let localParentElem;
      const localParentElemArr = [];
      const localElemID = nanoid(8);
      let localElem;

      switch (elemType) {
         case "obj":
            for (let key in elem) {
               if (typeof elem[key] === "object" && Array.isArray(elem[key])) {
                  localParentElem = clothesRecursion(nanoid(8), "arr", elem[key]);
                  if (localParentElem !== null) localParentElemArr.push(localParentElem);
               } else if (typeof elem[key] === "object") {
                  localParentElem = clothesRecursion(nanoid(8), "obj", elem[key]);
                  if (localParentElem !== null) localParentElemArr.push(localParentElem);
               } else {
                  if (key === 'name' && elem['isActive']) {
                     localElem = <div
                        key={localElemID}
                        className={"primitive"}
                        parentid={elem['parentId']}
                     >
                        {elem[key]}
                     </div>;
                     localParentElemArr.push(localElem);
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

      if (localParentElemArr.length > 1) {
         if (elem && typeof elem === "object" && !Array.isArray(elem) && elem['subCategories'].length > 0) {
            parentElem = <div id={parentID} key={parentID} className={"inside_div"}>
               <button
                  className={"plus_button"}
                  value={elem['id']}
                  onClick={(event) => console.log(event.target.value)}
               >
                  +
               </button>
               {localParentElemArr}
            </div>;
         } else {
            parentElem = <div id={parentID} key={parentID} className={"inside_div"}>
               {localParentElemArr}
            </div>;
         }
         return parentElem;
      }
      else if (localParentElemArr.length === 1) {
         // console.log(localParentElemArr[0]);
         return localParentElemArr[0]
      }
      else return null;
   }
   return (
      <div className="App">
         {tree}
      </div>
   );
}

export default Tree;
