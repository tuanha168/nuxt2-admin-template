export const UserConstant = Object.freeze({
  CRUMBS: [
    {
      path: '/',
      icon: 'home',
      breadcrumbName: 'home'
    },
    {
      path: '/users',
      breadcrumbName: 'Users'
    }
  ],
  COLUMNS: [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      scopedSlots: { customRender: 'id' },
      width: 80
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true
    },
    {
      title: 'Email Address',
      dataIndex: 'email',
      key: 'email',
      ellipsis: true
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      scopedSlots: { customRender: 'status' },
      width: 100
    },
    {
      title: '',
      key: 'action',
      align: 'center',
      scopedSlots: { customRender: 'action' },
      width: 80
    }
  ]
})
