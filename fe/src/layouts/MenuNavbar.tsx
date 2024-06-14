import { faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import SidebarMenu from 'react-bootstrap-sidebar-menu';

const MenuNavbar = () => {
  return (
    <SidebarMenu bg='light'>
      <SidebarMenu.Nav>
        <SidebarMenu.Sub>
          <SidebarMenu.Sub>
            <SidebarMenu.Nav>
              <SidebarMenu.Nav.Icon>
                <FontAwesomeIcon icon={faUser} style={{ fontSize: "25px" }} />
              </SidebarMenu.Nav.Icon>
              <SidebarMenu.Nav.Title>
                Người dùng
              </SidebarMenu.Nav.Title>
            </SidebarMenu.Nav>

          </SidebarMenu.Sub>
          <SidebarMenu.Sub>
            <SidebarMenu.Nav.Link href="/admin/user/add">Thêm mới</SidebarMenu.Nav.Link>
            <SidebarMenu.Nav.Link href="/admin/user/list">Danh sách</SidebarMenu.Nav.Link>
          </SidebarMenu.Sub>
        </SidebarMenu.Sub>
        {/* <SidebarMenuSub title="Bài viết">
          <SidebarMenuNavLink href="/admin/blog/list">Quản lý</SidebarMenuNavLink>
          <SidebarMenuNavLink href="/admin/blog/add">Thêm mới</SidebarMenuNavLink>
        </SidebarMenuSub>
        <SidebarMenuSub title="Series">
          <SidebarMenuNavLink href="/admin/series/list">Quản lý</SidebarMenuNavLink>
          <SidebarMenuNavLink href="/admin/series/add">Thêm mới</SidebarMenuNavLink>
        </SidebarMenuSub>
        <SidebarMenuSub title="Report">
          <SidebarMenuNavLink href="/admin/report/list">Quản lý</SidebarMenuNavLink>
        </SidebarMenuSub> */}
      </SidebarMenu.Nav>
    </SidebarMenu>
  );
};

export default MenuNavbar;
