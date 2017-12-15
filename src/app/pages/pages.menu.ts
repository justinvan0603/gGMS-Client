

export const PAGES_MENU = [
  {
    path: 'pages',
    children: [
      // {
      //   path: 'messages',
      //   data: {
      //     menu: {
      //       title: 'Thông báo',
      //       icon: 'ion-android-notifications-none',
      //       selected: false,
      //       expanded: false,
      //       order: 500,
      //     }
      //   },
      //   children: [
      //     {
      //       path: 'messagelist',
      //       data: {
      //         menu: {
      //           title: 'Danh sách thông báo',
      //         }
      //       }
      //     }
      //   ]
      // },
      // {
      //   path: 'charts',
      //   data: {
      //     menu: {
      //       title: 'Charts',
      //       icon: 'ion-stats-bars',
      //       selected: false,
      //       expanded: false,
      //       order: 200,
      //     }
      //   },
      //   children: [
      //     {
      //       path: 'chartist-js',
      //       data: {
      //         menu: {
      //           title: 'Chartist.Js',
      //         }
      //       }
      //     }
      //   ]
      // },
      {
        path: 'users',
        data: {
          menu: {
            title: 'Người dùng',
            icon: 'ion-person',
            selected: false,
            expanded: false,
            order: 500,
          }
        },
        children: [
          // {
          //   path: 'userlist',
          //   data: {
          //     menu: {
          //       title: 'Danh sách User',
          //     }
          //   }
          // }
          // ,
          {
            path: 'usergroup',
            data: {
              menu: {
                title: 'Nhóm người dùng',
              }
            }
          }
          ,
          {
            path: 'usermanager',
            data: {
              menu: {
                title: 'Danh sách User',
              }
            }
          } ,
          {
            path: 'userrole',
            data: {
              menu: {
                title: 'Quyền hệ thống',
              }
            }
          }
        ]
      },
      // {
      //   path: 'messageconfigurations',
      //   data: {
      //     menu: {
      //       title: 'Cấu hình',
      //       icon: 'ion-gear-a',
      //       selected: false,
      //       expanded: false,
      //       order: 500,
      //     }
      //   },
      //   children: [
      //     {
      //       path: 'messageconfigurationslist',
      //       data: {
      //         menu: {
      //           title: 'Cấu hình thông báo',
      //         }
      //       }
      //     }
      //   ]
      // },
      // {
      //   path: 'domains',
      //   data: {
      //     menu: {
      //       title: 'Domain',
      //       icon: 'ion-link',
      //       selected: false,
      //       expanded: false,
      //       order: 500,
      //     }
      //   },
      //   children: [
      //     {
      //       path: 'domainlist',
      //       data: {
      //         menu: {
      //           title: 'Danh sách Domain',
      //         }
      //       }
      //     }
      //   ]
      // },
      // {
      //   path: 'tables',
      //   data: {
      //     menu: {
      //       title: 'Tables',
      //       icon: 'ion-grid',
      //       selected: false,
      //       expanded: false,
      //       order: 500,
      //     }
      //   },



      //   children: [
      //     {
      //       path: 'basictables',
      //       data: {
      //         menu: {
      //           title: 'Basic Tables',
      //         }
      //       }
      //     },
      //     {
      //       path: 'smarttables',
      //       data: {
      //         menu: {
      //           title: 'Smart Tables',
      //         }
      //       }
      //     }
      //   ]
      // },

      {
        path: '',
        data: {
          menu: {
            title: 'Menu',
            icon: 'fa fa-bars',
            selected: false,
            expanded: false,
            order: 650,
          }
        },
        children: [
          {
            path: ['menurole'],
            data: {
              menu: {
                title: 'Danh mục Menu'
              }
            }
          }

        ]
      },
      {
        path: 'customers',
        data: {
          menu: {
            title: 'Khách hàng',
            icon: 'ion-ios-people',
            selected: false,
            expanded: false,
            order: 500,
          }
        },
        children: [
          {
            path: 'customerslist',
            data: {
              menu: {
                title: 'Danh mục khách hàng',
              }
            }
          }
        ]
      },
      // {
      //   path: 'prdtemplates',
      //   data: {
      //     menu: {
      //       title: 'Template',
      //       icon: 'ion-crop',
      //       selected: false,
      //       expanded: false,
      //       order: 500,
      //     }
      //   },
      //   children: [
      //     {
      //       path: 'templateslist',
      //       data: {
      //         menu: {
      //           title: 'Danh mục Template',
      //         }
      //       }
      //     }
      //   ]
      // },
      // {
      //   path: 'source',
      //   data: {
      //     menu: {
      //       title: 'Source',
      //       icon: 'fa fa-code',
      //       selected: false,
      //       expanded: false,
      //       order: 500,
      //     }
      //   },
      //   children: [
      //     {
      //       path: 'sourcelist',
      //       data: {
      //         menu: {
      //           title: 'Danh sách source',
      //         }
      //       }
      //     }
      //   ]
      // },
// {
//         path: 'prdplugins',
//         data: {
//           menu: {
//             title: 'Plugin',
//             icon: 'fa fa-cogs',
//             selected: false,
//             expanded: false,
//             order: 500,
//           }
//         },
//         children: [
//           {
//             path: 'pluginslist',
//             data: {
//               menu: {
//                 title: 'Danh sách Plugin',
//               }
//             }
//           }
//         ]
//       },
      {
        path: 'prdproduct',
        data: {
          menu: {
            title: 'Sản phẩm',
            icon: 'fa fa-product-hunt',
            selected: false,
            expanded: false,
            order: 500,
          }
        },
        children: [
          {
            path: 'productslist',
            data: {
              menu: {
                title: 'Danh sách sản phẩm',
              }
            }
          },
          {
            path: 'pluginslist',
            data: {
              menu: {
                title: 'Danh sách Plugin',
              }
            }
          },
          {
            path: 'templateslist',
            data: {
              menu: {
                title: 'Danh sách Template',
              }
            }
          },
          {
            path: 'sourcelist',
            data: {
              menu: {
                title: 'Danh sách Source',
              }
            }
          },
          {
            path: 'categorieslist',
            data: {
              menu: {
                title: 'Danh sách lĩnh vực',
              }
            }
          }
          , {
            path: 'productsnoteslist',
            data: {
              menu: {
                title: 'Danh sách sản phẩm ghi chú',
              }
            }
          }
        ]
      },
      {
        path: 'contract',
        data: {
          menu: {
            title: 'Hợp đồng',
            icon: 'fa fa-file-text-o',
            selected: false,
            expanded: false,
            order: 500,
          }
        },
        children: [
          {
            path: 'contractlist',
            data: {
              menu: {
                title: 'Danh sách hợp đồng',
              }
            }
          }
        ]
      },
      {
        path: 'prjproject',
        data: {
          menu: {
            title: 'Dự án',
            icon: 'fa fa-file-text-o',
            selected: false,
            expanded: false,
            order: 500,
          }
        },
        children: [
          {
            path: 'prjprojectlist',
            data: {
              menu: {
                title: 'Danh sách dự án',
              }
            }
          },
          {
            path: 'prjprojectchart',
            data: {
              menu: {
                title: 'Biểu đồ hoạt động',
              }
            }
          }
        ],

      },

      {
        path: 'webcontrol',
        data: {
          menu: {
            title: 'Điều khiển Tenant',
            icon: 'fa fa-wrench',
            selected: false,
            expanded: false,
            order: 500,
          }
        },
        children: [
          {
            path: 'webcontrollist',
            data: {
              menu: {
                title: 'Điều khiển Website',
              }
            }
          },
          {
            path: 'installedpluginlist',
            data: {
              menu: {
                title: 'Phân phối Plugin',
              }
            }
          }
        ]
      },
      {
        path: 'chatbot',
        data: {
          menu: {
            title: 'Quản lý Chatbot',
            icon: 'fa fa-commenting-o',
            selected: false,
            expanded: false,
            order: 500,
          }
        },
        children: [
          {
            path: 'botcustomerinfolist',
            data: {
              menu: {
                title: 'Khách hàng tiềm năng',
              }
            }
          },
          {
            path: 'botscenariolist',
            data: {
              menu: {
                title: 'Kịch bản',
              }
            }
          },
          {
            path: 'botdomainlist',
            data: {
              menu: {
                title: 'Đăng ký Chatbot',
              }
            }
          }
        ]
      }





    ]
  }
];
