require 'open-uri'
require 'rexml/document'

# Retrieve geocode information for all records in the Stores table
task :google_geocode => :environment do

	api_key="ABQIAAAA79LF48tNWuXibO9YAERqGBToI0b0qGIfd9nR7ssbdnkbnq_TOxTyEp2dX-MPR_hEyr2cNaYieIFMMg"

	(Store.find :all).each do |store|
		puts "\nStore: #{store.name}"
		puts "Source Address: #{store.full_address}"
			xml=open("http://maps.google.com/maps/geo?q=#{CGI.escape(store.full_address)}&output=xml&key=#{api_key}").read
		doc=REXML::Document.new(xml)
	
		puts "Status: "+doc.elements['//kml/Response/Status/code'].text
	
		if doc.elements['//kml/Response/Status/code'].text != '200'
			puts "Unable to parse Google response for #{store.name}"
		else
			doc.root.each_element('//Response') do |response|
				response.each_element('//Placemark') do |place|
					lng,lat=place.elements['//coordinates'].text.split(',')
	
					puts "Result Address: " << place.elements['//address'].text
					puts " Latitude: #{lat}"
					puts " Longitude: #{lng}"
				end # end each place
			end # end each response
		end # end if result == 200
	end # end each store
end # end rake task

# geocode all the stores in our database with Yahoo's geocoder
task :yahoo_geocode => :environment do
	(Store.find :all).each do |store|
		puts "\nStore: #{store.name}"

## Need to sign up for an app key

		url="http://api.local.yahoo.com/MapsService/V1/geocode?appid=YOUR_APPLICATION_KEY&location=#{CGI.escape(store.full_address)}"
			xml=open(url).read
			doc=REXML::Document.new(xml)

			doc.root.each_element('//Result') do |result|
				puts "Result Precision: " << result.attributes['precision']
				if result.attributes['precision'] != 'address'
					puts "Warning: " << result.attributes['warning']
					puts "Address: " << result.elements['//Address'].text.to_s
				end

				puts "Latitude: " << result.elements['//Latitude'].text
				puts "Longitude: " << result.elements['//Longitude'].text
			end # end each result
		end # end each store
end # end task

task :geocoder_us => :environment do
	(Store.find :all).each do |store|
		puts "\nStore: #{store.name}"
		url="http://geocoder.us/service/csv/geocode?address=#{CGI.escape(store.full_address)}"
		res=open(url).read.chomp
		lat,lng,address,city,state,zip=res.split(',')
		puts "Latitude: #{lat}"
		puts "Longitude: #{lng}"
	end # end each store
end # end task

task :geocoder_ca => :environment do
	street_no = "301"
	street = "Front Street West"
	city = "Toronto"
	prov = "ON"
	postal = "M5V2T6"
	url="http://geocoder.ca/?"
		url << "&stno=" << CGI.escape(street_no)
		url << "&addresst=" << CGI.escape(street)
		url << "&city=" << CGI.escape(city)
		url << "&prov=" << CGI.escape(prov)
		url << "&postal=" << CGI.escape(postal)
		url << "&geoit=XML"
	xml=open(url).read
	doc=REXML::Document.new(xml)
	puts "The CN tower is located here:"
	puts "Latitude: " << doc.root.elements['//latt'].text
	puts "Longitude: " << doc.root.elements['//longt'].text
end

task :google_persist => :environment do
	api_key="ABQIAAAA79LF48tNWuXibO9YAERqGBToI0b0qGIfd9nR7ssbdnkbnq_TOxTyEp2dX-MPR_hEyr2cNaYieIFMMg"
	(Store.find :all).each do |store|
		puts "\nStore: #{store.name}"
		puts "Source Address: #{store.full_address}"
		xml=open("http://maps.google.com/maps/geo?q=#{CGI.escape(store.full_address)}&output=xml&key=#{api_key}").read
		doc=REXML::Document.new(xml)
		puts "Status: "+doc.elements['//kml/Response/Status/code'].text

		if doc.elements['//kml/Response/Status/code'].text != '200'
			puts "Unable to parse Google response for #{store.name}"
		else
			lng,lat=doc.root.elements['//coordinates'].text.split(',')
			store.lat=lat
			store.lng=lng
			store.save
		end # end if result == 200
	end # end each store
end # end rake task
