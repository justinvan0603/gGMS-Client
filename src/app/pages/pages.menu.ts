

export const PAGES_MENU = [
  {
    path: 'pages',
    children: [

      
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
      },
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





    ]
  }
];
