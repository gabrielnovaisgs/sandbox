/*data "libvirt_domain_interface_addresses" "ips" {
  for_each = local.vms
  domain = libvirt_domain.vm[each.key].name
  source="lease"
}
*/

