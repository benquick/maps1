class Store < ActiveRecord::Base

  def full_address
    "#{address}, #{city}, #{state}, #{zip}"
  end

end
