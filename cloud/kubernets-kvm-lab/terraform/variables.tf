variable "storage_pool" {
  description = "Pool de storage do libvirt"
  type        = string
  default     = "iso"
}

variable "base_image_url" {
  description = "URL da imagem base Ubuntu"
  type        = string
  default     = "https://cloud-images.ubuntu.com/noble/current/noble-server-cloudimg-amd64.img"
}

variable "ssh_public_key" {
  description = "Chave SSH pública para acesso às VMs"
  type        = string
  default     = "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAICzK/2w/gtx0UMJZsyeO1Kt16mHPs+GvGQsEa1+1M1T2 gabrielnovaisgs@gmail.com"
}