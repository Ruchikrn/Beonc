import React, { useEffect, useState } from 'react'
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend
} from "recharts";


import { dynamicGraph } from '../../utils/dynamicGraph';
import { color } from '../color';
import { host } from '../../utils';
import { nameSort } from '../../utils';
import Select from 'react-select';

const CeoncQualityDomain = ({graphWidth, data3, dataType3}) => {
  const [data, setData] = useState([])
  const [dataSort, setDataSort] = useState([])
   const [dataSortPalikaProvince, setDataSortPalikaProvince] = useState();
   const [dataSortProvince, setDataSortProvince] = useState();
   const [dataSortOnlyFacility, setdataSortOnlyFacility] = useState();
   const [value1, setValue1] = useState('');
   const [value5, SetValue5] = useState('');

  const requestOptions = {
      method: 'GET',
      headers: {
          "Content-Type": "application/json",
      },
      mode: 'cors'
  }

  let filterType = "default"

  if (data3 === "year") {
    filterType = "year"
  } else if (data3 === "province") {
    filterType = "province"
  } else if (data3 === "palika") {
    filterType = "palika"
  } else if (data3 === "all") {
    filterType = "all"
  } else if (data3 === "month") {
    filterType = "month"
  }


  useEffect(() => {
    let dismount = false

    const getRequest = async () => {
      let res = await fetch(`${host}/ceonc/qualitydomain`, requestOptions)
      let data = await res.json()

      if (!dismount) {
        if (res.ok) {
          setData(data)
        }
      }
    }
    const getRequestPalikaProvince = async () => {
      let res = await fetch(`${host}/palikaprovince`, requestOptions);
      let data = await res.json();

      if (!dismount) {
        if (res.ok) {
          setDataSortPalikaProvince(data);
          setDataSortProvince(nameSort(data, '', 'province'));
        }
      }
    };

    const getRequestYear = async () => {
      if (filterType === "all") {
        let requestOptionsBody = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
              "startDate": dataType3["startDate"],
              "endDate": dataType3["endDate"],
              "province": dataType3["province"] === "All" ? "" : dataType3["province"],
              "district": dataType3["district"] === "All" ? "" : dataType3["district"],
              "palika": dataType3["palika"] === "All" ? "" : dataType3["palika"],
              "facility": dataType3["facility"] === "All" ? "" : dataType3["facility"]
            }), 
            mode: 'cors'
        }

        let res = await fetch(`${host}/ceonc/qualitydomain/filter`, requestOptionsBody)
        let data = await res.json()

        if (!dismount) {
          if (res.ok) {
            setDataSort(data)
          }
        }
      }
      // if (filterType === "year") {
      //   let res = await fetch('/ceonc/qualitydomain/year', requestOptions)
      //   let data = await res.json()

      //   if (!dismount) {
      //     if (res.ok) {
      //       setDataSort(data)
      //     }
      //   }
      // } else if (filterType === "province") {
      //     let res = await fetch('/ceonc/qualitydomain/province', requestOptions)
      //     let data = await res.json()

      //     if (!dismount) {
      //       if (res.ok) {
      //         setDataSort(data)
      //       }
      //     }
      // } else if (filterType === "palika") {
      //     let res = await fetch('/ceonc/qualitydomain/palika', requestOptions)
      //     let data = await res.json()

      //     if (!dismount) {
      //       if (res.ok) {
      //         setDataSort(data)
      //       }
      //     }
      // } else if (filterType === "all") {
      //     let res = await fetch('/ceonc/qualitydomain/all', requestOptions)
      //     let data = await res.json()

      //     if (!dismount) {
      //       if (res.ok) {
      //         setDataSort(data)
      //       }
      //     }
      // } else if (filterType === "month") {
      //     let res = await fetch('/ceonc/qualitydomain/month', requestOptions)
      //     let data = await res.json()

      //     if (!dismount) {
      //       if (res.ok) {
      //         setDataSort(data)
      //       }
      //     }
      // }
    }
  getRequestPalikaProvince();
    getRequest()
    getRequestYear()
    return () => {
      dismount = true
    }
  }, [dataType3])

   const palikaSelector = (selected, type) => {
     if (type === 'province') {
       setdataSortOnlyFacility(
         nameSort(dataSortPalikaProvince, selected, 'OnlyProvince')
       );
     }
   };

  if (filterType !== "default") {
    return (
      <div className='graphItems'>
        {dataSort.map((items, index) => {
          return (
            <div key={index} className="graphItem">
              <p className="text-center header-color">
                {items['date']} {items['province']} {items['district']}{' '}
                {items['palika']} {items['facility']}
              </p>
              <div>
                <p className="text-center header-color">
                  No of CEONC hospitals status in 8 Quality Domains
                </p>
              </div>
              <div className="flex gap-2 mb-2 justify-center">
                <div className="box">
                  Province
                  <Select
                    className="select-dropdown"
                    options={dataSortProvince}
                    value={value1}
                    onChange={(option) => {
                      setValue1(option);
                      palikaSelector(option, 'province');
                    }}
                  />
                </div>
                <div className="box">
                  Facilities by Province
                  <Select
                    className="select-dropdown"
                    options={dataSortOnlyFacility}
                    value={value5}
                    onChange={(option) => {
                      SetValue5(option);
                      palikaSelector(option, 'OnlyProvince');
                    }}
                  />
                </div>
              </div>
              <BarChart
                width={dynamicGraph(graphWidth)}
                height={500}
                data={items['data']}
              >
                <CartesianGrid strokeDasharray="9 9" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="good" stackId="a" fill={color.color_1} />
                <Bar dataKey="medium" stackId="a" fill={color.color_2} />
                <Bar dataKey="poor" stackId="a" fill={color.color_3} />
              </BarChart>
            </div>
          );
        })}
      </div>
    )
  } else {
    return (
      <div>
        <div>
          <p className="text-center header-color">No of CEONC hospitals status in 8 Quality Domains</p>
        </div>
        <BarChart
          width={dynamicGraph(graphWidth)}
          height={500}
          data={data}
        >
          <CartesianGrid strokeDasharray="9 9" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="good" stackId="a" fill={color.color_1} />
          <Bar dataKey="medium" stackId="a" fill={color.color_2} />
          <Bar dataKey="poor" stackId="a" fill={color.color_3} />
        </BarChart>
      </div>
    )
  }
}

export default CeoncQualityDomain