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
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true
    },
    {
      title: 'User Name',
      dataIndex: 'username',
      key: 'username',
      ellipsis: true
    },
    {
      title: 'Email Address',
      dataIndex: 'email',
      key: 'email',
      ellipsis: true
    },
    {
      title: 'Gender',
      dataIndex: 'sex',
      key: 'sex',
      align: 'center',
      scopedSlots: { customRender: 'sex' },
      width: 100
    },
    {
      title: '',
      key: 'action',
      align: 'center',
      scopedSlots: { customRender: 'action' },
      width: 100
    }
  ]
})
