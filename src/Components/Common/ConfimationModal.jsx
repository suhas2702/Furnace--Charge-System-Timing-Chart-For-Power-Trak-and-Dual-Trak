import IconBtn from "./IconBtn";

export default function ConfirmationModal({ modalData }) {
  return (
    <div className="fixed inset-0 z-[1000] !mt-0 grid place-items-center overflow-auto bg-black/30 backdrop-blur-sm">
      <div className="w-11/12 max-w-[400px] rounded-2xl border border-[#6E727F] bg-white p-6 shadow-2xl">
        <p className="text-xl font-semibold text-center text-black">
          {modalData?.text1}
        </p>
        <p className="mt-2 mb-5 leading-6 text-center text-black">
          {modalData?.text2}
        </p>
        <div className="flex items-center justify-center gap-x-4">
          <IconBtn
            onclick={modalData?.btn1Handler}
            text={modalData?.btn1Text}
          />
          <button
            className="cursor-pointer rounded-md bg-[white py-[8px] px-[20px] font-semibold text-black border"
            onClick={modalData?.btn2Handler}
          >
            {modalData?.btn2Text}
          </button>
        </div>
      </div>
    </div>
  );
}

// import IconBtn from "./IconBtn";

// export default function ConfirmationModal({ modalData }) {
//   return (
//     <div className="fixed inset-0 z-[1000] !mt-0 grid place-items-center overflow-auto  backdrop-blur-sm">
//       <div className="w-11/12 max-w-[380px] rounded-lg border border-[#6E727F] bg-[#161D29] p-10">
//         <p className="text-2xl font-semibold text-[#F1F2FF]">
//           {modalData?.text1}
//         </p>
//         <p className="mt-3 mb-5 leading-6 text-[#999DAA]">{modalData?.text2}</p>
//         <div className="flex items-center gap-x-4">
//           <IconBtn
//             onclick={modalData?.btn1Handler}
//             text={modalData?.btn1Text}
//           />
//           <button
//             className="cursor-pointer rounded-md bg-[#999DAA] py-[8px] px-[20px] font-semibold text-[#000814]"
//             onClick={modalData?.btn2Handler}
//           >
//             {modalData?.btn2Text}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
