output "ips" {
  value = [
    for key, vm in local.vms : data.libvirt_domain_interface_addresses.ips[key].interfaces[0].addrs[0].addr
  ]
  description = "ips from vms"
}